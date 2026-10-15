// Globe — Originkit (Customized for Washington DC Hub & Network Arcs)
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    MeshBasicMaterial,
    LineDashedMaterial,
    ShaderMaterial,
    AdditiveBlending,
    BufferGeometry,
    Line,
    Color,
    Mesh,
    Group,
    InstancedMesh,
    Matrix4,
    TubeGeometry,
    CatmullRomCurve3,
    Vector3,
    CanvasTexture,
} from "three";
import { geoEquirectangular, geoPath } from "d3-geo";

// Module-level cache for GeoJSON land data to eliminate network fetch delays & re-initialization flashes
let cachedLandFeatures: any = null;
let landFetchPromise: Promise<any> | null = null;

// Built-in coarse GeoJSON fallback so the globe works 100% offline or if CDNs are blocked
const FALLBACK_LAND_GEOJSON = {
    type: "FeatureCollection",
    features: [
        // North America
        {
            type: "Feature",
            properties: { name: "North America" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-168, 66], [-140, 70], [-120, 78], [-80, 82], [-60, 60],
                    [-55, 48], [-65, 44], [-75, 35], [-80, 25], [-90, 16],
                    [-105, 20], [-118, 32], [-125, 48], [-160, 58], [-168, 66]
                ]]
            }
        },
        // South America
        {
            type: "Feature",
            properties: { name: "South America" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-80, 10], [-60, 10], [-35, -5], [-38, -18], [-55, -22],
                    [-68, -55], [-75, -45], [-80, -18], [-80, 10]
                ]]
            }
        },
        // Eurasia
        {
            type: "Feature",
            properties: { name: "Eurasia" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-10, 36], [0, 42], [15, 38], [28, 41], [30, 31],
                    [35, 33], [45, 12], [75, 8], [80, 20], [100, 5],
                    [105, 10], [120, 22], [125, 32], [140, 36], [142, 50],
                    [170, 66], [180, 70], [120, 76], [60, 70], [25, 71],
                    [10, 62], [5, 52], [-10, 50], [-10, 36]
                ]]
            }
        },
        // Africa
        {
            type: "Feature",
            properties: { name: "Africa" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-17, 15], [-5, 36], [11, 37], [32, 31], [43, 12],
                    [51, 11], [40, -10], [33, -28], [20, -35], [12, -18],
                    [8, 5], [-17, 15]
                ]]
            }
        },
        // Australia
        {
            type: "Feature",
            properties: { name: "Australia" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [113, -22], [130, -12], [142, -11], [153, -28], [148, -38],
                    [138, -35], [115, -34], [113, -22]
                ]]
            }
        },
        // Antarctica
        {
            type: "Feature",
            properties: { name: "Antarctica" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-180, -70], [-120, -72], [-60, -68], [0, -70],
                    [60, -68], [120, -72], [180, -70], [180, -89], [-180, -89], [-180, -70]
                ]]
            }
        }
    ]
};

async function getLandFeatures() {
    if (cachedLandFeatures) return cachedLandFeatures;
    if (!landFetchPromise) {
        landFetchPromise = (async () => {
            const urls = [
                "https://cdn.jsdelivr.net/gh/martynafford/natural-earth-geojson@master/50m/physical/ne_50m_land.json",
                "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/50m/physical/ne_50m_land.json",
                "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json"
            ];

            for (const url of urls) {
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.features && data.features.length > 0) {
                            cachedLandFeatures = data;
                            return data;
                        }
                    }
                } catch {
                    // Try next mirror
                }
            }

            // Fallback if network is offline or all endpoints failed
            cachedLandFeatures = FALLBACK_LAND_GEOJSON;
            return FALLBACK_LAND_GEOJSON;
        })();
    }
    return landFetchPromise;
}

type Rgba = { r: number; g: number; b: number; a: number };

function parseColorToRgba(input: string): Rgba {
    if (!input || input.trim() === "") return { r: 0, g: 0, b: 0, a: 0 };
    const str = input.trim();
    const rgbaMatch = str.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i
    );
    if (rgbaMatch) {
        const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
        const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
        const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
        const a =
            rgbaMatch[4] !== undefined
                ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4])))
                : 1;
        return { r, g, b, a };
    }
    const hex = str.replace(/^#/, "");
    if (hex.length === 8) {
        return {
            r: parseInt(hex.slice(0, 2), 16) / 255,
            g: parseInt(hex.slice(2, 4), 16) / 255,
            b: parseInt(hex.slice(4, 6), 16) / 255,
            a: parseInt(hex.slice(6, 8), 16) / 255,
        };
    }
    if (hex.length === 6) {
        return {
            r: parseInt(hex.slice(0, 2), 16) / 255,
            g: parseInt(hex.slice(2, 4), 16) / 255,
            b: parseInt(hex.slice(4, 6), 16) / 255,
            a: 1,
        };
    }
    if (hex.length === 4) {
        return {
            r: parseInt(hex[0] + hex[0], 16) / 255,
            g: parseInt(hex[1] + hex[1], 16) / 255,
            b: parseInt(hex[2] + hex[2], 16) / 255,
            a: parseInt(hex[3] + hex[3], 16) / 255,
        };
    }
    if (hex.length === 3) {
        return {
            r: parseInt(hex[0] + hex[0], 16) / 255,
            g: parseInt(hex[1] + hex[1], 16) / 255,
            b: parseInt(hex[2] + hex[2], 16) / 255,
            a: 1,
        };
    }
    return { r: 0, g: 0, b: 0, a: 1 };
}

function mapLinear(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    if (inMax === inMin) return outMin;
    const t = (value - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
}

function mapSpeedUiToInternal(ui: number): number {
    if (ui === 0) return 0;
    const clamped = Math.max(0, Math.min(10, ui));
    return mapLinear(clamped, 0, 10, 0, 0.9);
}
function mapDensityUiToSpacing(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 24, 8);
}
function mapScaleUiToMultiplier(ui: number): number {
    const clamped = Math.max(1, Math.min(20, ui));
    return mapLinear(clamped, 1, 20, 0.2, 2);
}
function mapDotSizeUiToMultiplier(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 0.1, 0.5);
}
function mapMarkerDotSizeUiToMultiplier(ui: number): number {
    const clamped = Math.max(0, Math.min(100, ui));
    return mapLinear(clamped, 0, 100, 0.1, 2.5);
}
function normalizeSmoothing(ui: number): number {
    return Math.max(0, Math.min(1, ui / 10));
}
function mapDragSpeedUiToSensitivity(ui: number): number {
    return mapLinear(Math.max(0, Math.min(10, ui)), 0, 10, 0.001, 0.02);
}
function mapDetailToStepSize(ui: number): number {
    const clamped = Math.max(1, Math.min(10, ui));
    return mapLinear(clamped, 1, 10, 10, 1);
}

function simplifyRing(ring: number[][], detail: number): number[][] {
    if (ring.length < 2) return ring;
    if (detail >= 10) return ring;
    const stepSize = Math.max(1, Math.floor(mapDetailToStepSize(detail)));
    const simplified: number[][] = [];
    simplified.push(ring[0]);
    for (let i = stepSize; i < ring.length - 1; i += stepSize) {
        const idx = Math.min(i, ring.length - 1);
        simplified.push(ring[idx]);
    }
    const lastPoint = ring[ring.length - 1];
    const firstPoint = ring[0];
    const isClosed =
        Math.abs(lastPoint[0] - firstPoint[0]) < 1e-4 &&
        Math.abs(lastPoint[1] - firstPoint[1]) < 1e-4;
    if (!isClosed) {
        simplified.push(lastPoint);
    }
    return simplified.length >= 2 ? simplified : ring;
}

function latLngToPosition(
    lat: number,
    lng: number
): { x: number; y: number; z: number } {
    const latRad = lat * (Math.PI / 180);
    const lngRad = lng * (Math.PI / 180);
    const x = Math.cos(latRad) * Math.sin(lngRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.cos(lngRad);
    return { x, y, z };
}

// Key world capital locations for interconnectivity arcs
const WASHINGTON_DC = { name: "Washington, D.C.", lat: 38.9072, lng: -77.0369 };

const WORLD_CAPITALS = [
    { name: "Beijing", lat: 39.9042, lng: 116.4074 },
    { name: "Moscow", lat: 55.7558, lng: 37.6173 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Brasília", lat: -15.7975, lng: -47.8919 },
    { name: "Cairo", lat: 30.0444, lng: 31.2357 },
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "Singapore", lat: 1.3521, lng: 103.8198 },
];

interface Marker {
    lat: number;
    lng: number;
    name?: string;
}
interface MarkerConfig {
    markers: Marker[];
    color: string;
    size: number;
}
interface DotsConfig {
    color: string;
    size: number;
    density: number;
    allDots: boolean;
}
interface GlobeProps {
    speed?: number;
    smoothing?: number;
    dots?: DotsConfig;
    fill?: "dots" | "solid";
    fillColor?: string;
    scale?: number;
    stopOnHover?: boolean;
    markerConfig?: MarkerConfig;
    direction?: "left" | "right";
    initialLatitude?: number;
    initialLongitude?: number;
    oceanColor?: string;
    outlineColor?: string;
    showOutline?: boolean;
    graticuleColor?: string;
    showGrid?: boolean;
    outlineWidth?: number;
    dragSpeed?: number;
    detail?: number;
    style?: CSSProperties;
    arcColor?: string;
    pulseColor?: string;
}

export default function Globe({
    speed = 2,
    smoothing = 8,
    dots = { color: "#ffffff", size: 5, density: 8, allDots: false },
    fill = "dots",
    fillColor = "#ffffff",
    scale = 8,
    stopOnHover = false, // Set default to false for continuous rotation
    markerConfig = {
        markers: [WASHINGTON_DC, ...WORLD_CAPITALS],
        color: "#00f7ff",
        size: 35,
    },
    direction = "left",
    initialLatitude = 30,
    initialLongitude = -75,
    oceanColor = "#00000012",
    outlineColor = "#77CC7D",
    showOutline = true,
    graticuleColor = "#D4D4D4",
    showGrid = false,
    outlineWidth = 1,
    dragSpeed = 5,
    detail = 5,
    style,
    arcColor = "#00f7ff",
    pulseColor = "#ff007f",
}: GlobeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dotColor = dots.color;
    const dotSize = dots.size;
    const density = dots.density;
    const allDots = dots.allDots;
    const gridWidth = 1;
    const smoothingN = normalizeSmoothing(smoothing);

    const baseRotationSpeed = mapSpeedUiToInternal(speed);
    const rotationSpeed =
        direction === "left" ? -baseRotationSpeed : baseRotationSpeed;
    const dotSpacing = mapDensityUiToSpacing(density);
    const dotSizeMultiplier = mapDotSizeUiToMultiplier(dotSize);
    const markerRadiusMultiplier = mapMarkerDotSizeUiToMultiplier(
        markerConfig.size
    );
    const scaleMultiplier = mapScaleUiToMultiplier(scale);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const containerWidth =
            container.clientWidth || container.offsetWidth || 800;
        const containerHeight =
            container.clientHeight || container.offsetHeight || 600;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
            50,
            containerWidth / containerHeight,
            0.1,
            1e3
        );
        const baseRadius = 1;
        const globeRadius = baseRadius * scaleMultiplier;
        const aspect = containerWidth / containerHeight;
        const baseDistance = 2.65 / scaleMultiplier;
        const cameraDistance = aspect < 1 ? baseDistance / Math.max(aspect, 0.5) : baseDistance;
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);

        const renderer = new WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = "srgb";
        const canvas = renderer.domElement;
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.style.opacity = "1";
        canvas.style.visibility = "visible";
        canvas.style.transition = "opacity 0.3s ease";
        container.appendChild(canvas);

        const resolvedOceanColor = oceanColor;
        const resolvedOutlineColor = outlineColor;
        const resolvedDotColor = dotColor;
        const resolvedMarkerColor = markerConfig.color;
        const resolvedGraticuleColor = graticuleColor;
        const resolvedFillColor = fillColor;
        const oceanRgba = parseColorToRgba(resolvedOceanColor);
        const outlineRgba = parseColorToRgba(resolvedOutlineColor);
        const dotRgba = parseColorToRgba(resolvedDotColor);
        const markerRgba = parseColorToRgba(resolvedMarkerColor);
        const graticuleRgba = parseColorToRgba(resolvedGraticuleColor);
        const fillRgba = parseColorToRgba(resolvedFillColor);
        void markerRgba;

        const oceanGeometry = new SphereGeometry(globeRadius, 64, 64);
        const oceanColorObj = resolvedOceanColor
            ? new Color(resolvedOceanColor)
            : new Color(0, 0, 0);
        const oceanMaterial = new MeshBasicMaterial({
            color: oceanColorObj,
            transparent: oceanRgba.a < 1 || oceanRgba.a === 0,
            opacity: oceanRgba.a,
        });
        const oceanMesh = new Mesh(oceanGeometry, oceanMaterial);
        scene.add(oceanMesh);

        let globeOutlineMesh: Mesh | null = null;
        if (showOutline && outlineColor && outlineRgba.a > 0) {
            const outlinePositions: number[] = [];
            const segments = 128;
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                const x = Math.cos(angle) * globeRadius;
                const y = Math.sin(angle) * globeRadius;
                const z = 0;
                outlinePositions.push(x, y, z);
            }
            const outlinePoints: Vector3[] = [];
            for (let i = 0; i < outlinePositions.length; i += 3) {
                outlinePoints.push(
                    new Vector3(
                        outlinePositions[i],
                        outlinePositions[i + 1],
                        outlinePositions[i + 2]
                    )
                );
            }
            if (outlinePoints.length >= 2) {
                outlinePoints.push(outlinePoints[0].clone());
                const outlineColorObj = new Color(resolvedOutlineColor);
                const outlineMaterial = new MeshBasicMaterial({
                    color: outlineColorObj,
                    transparent: outlineRgba.a < 1,
                    opacity: outlineRgba.a,
                });
                const curve = new CatmullRomCurve3(outlinePoints);
                const radius = (outlineWidth / 10) * 0.01;
                const tubeGeometry = new TubeGeometry(
                    curve,
                    outlinePoints.length * 2,
                    radius,
                    8,
                    false
                );
                globeOutlineMesh = new Mesh(tubeGeometry, outlineMaterial);
            }
        }
        void globeOutlineMesh;

        const continentOutlineGroup = new Group();

        const graticuleGroup = new Group();
        if (showGrid && resolvedGraticuleColor && graticuleRgba.a > 0) {
            const graticuleColorObj = resolvedGraticuleColor
                ? new Color(resolvedGraticuleColor)
                : new Color(1, 1, 1);
            const graticuleMaterial = new MeshBasicMaterial({
                color: graticuleColorObj,
                transparent: graticuleRgba.a < 1 || graticuleRgba.a === 0,
                opacity: graticuleRgba.a,
            });
            const gridSpacing = 15;
            for (let lat = -90; lat <= 90; lat += gridSpacing) {
                const positions: number[] = [];
                const segments = 64;
                for (let i = 0; i <= segments; i++) {
                    const lng = (i / segments) * 360 - 180;
                    const pos = latLngToPosition(lat, lng);
                    positions.push(
                        pos.x * globeRadius,
                        pos.y * globeRadius,
                        pos.z * globeRadius
                    );
                }
                if (positions && positions.length >= 6) {
                    const points: Vector3[] = [];
                    for (let i = 0; i < positions.length; i += 3) {
                        points.push(
                            new Vector3(
                                positions[i],
                                positions[i + 1],
                                positions[i + 2]
                            )
                        );
                    }
                    if (points.length >= 2) {
                        const curve = new CatmullRomCurve3(points);
                        const radius = (gridWidth / 10) * 0.01;
                        const tubeGeometry = new TubeGeometry(
                            curve,
                            points.length * 2,
                            radius,
                            8,
                            false
                        );
                        const tubeMesh = new Mesh(
                            tubeGeometry,
                            graticuleMaterial
                        );
                        tubeMesh.renderOrder = 0;
                        graticuleGroup.add(tubeMesh);
                    }
                }
            }
            for (let lng = -180; lng < 180; lng += gridSpacing) {
                const positions: number[] = [];
                const segments = 64;
                for (let i = 0; i <= segments; i++) {
                    const lat = (i / segments) * 180 - 90;
                    const pos = latLngToPosition(lat, lng);
                    positions.push(
                        pos.x * globeRadius,
                        pos.y * globeRadius,
                        pos.z * globeRadius
                    );
                }
                if (positions && positions.length >= 6) {
                    const points: Vector3[] = [];
                    for (let i = 0; i < positions.length; i += 3) {
                        points.push(
                            new Vector3(
                                positions[i],
                                positions[i + 1],
                                positions[i + 2]
                            )
                        );
                    }
                    if (points.length >= 2) {
                        const curve = new CatmullRomCurve3(points);
                        const radius = (gridWidth / 10) * 0.01;
                        const tubeGeometry = new TubeGeometry(
                            curve,
                            points.length * 2,
                            radius,
                            8,
                            false
                        );
                        const tubeMesh = new Mesh(
                            tubeGeometry,
                            graticuleMaterial
                        );
                        tubeMesh.renderOrder = 0;
                        graticuleGroup.add(tubeMesh);
                    }
                }
            }
        }

        let dotInstances: InstancedMesh | Mesh | null = null;
        let markerMeshes: Mesh[] = [];

        // Group to hold communication network arcs
        const networkArcsGroup = new Group();
        type AnimatedShaderArc = {
            material: ShaderMaterial;
            phase: number;
            pulseFreq: number;
        };
        const animatedShaderArcs: AnimatedShaderArc[] = [];

        // Calculate smooth Great Circle 3D arc points on a sphere (Slerp)
        const createGreatCircleArcPoints = (
            startVec: Vector3,
            endVec: Vector3,
            radius: number,
            numPoints = 100
        ): Vector3[] => {
            const points: Vector3[] = [];
            const v1 = startVec.clone().normalize();
            const v2 = endVec.clone().normalize();

            let dot = v1.dot(v2);
            dot = Math.max(-0.9999, Math.min(0.9999, dot));
            const omega = Math.acos(dot);
            const sinOmega = Math.sin(omega);

            // Calculate peak elevation based on distance
            const maxElevation = radius * 0.25 * Math.sin(omega / 2);

            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                let p: Vector3;

                if (sinOmega < 0.0001) {
                    p = v1.clone().lerp(v2, t).normalize();
                } else {
                    const a = Math.sin((1 - t) * omega) / sinOmega;
                    const b = Math.sin(t * omega) / sinOmega;
                    p = new Vector3()
                        .addVectors(
                            v1.clone().multiplyScalar(a),
                            v2.clone().multiplyScalar(b)
                        )
                        .normalize();
                }

                // Smooth sinusoidal arc height above globe surface (0 at ends, max at mid)
                const currentRadius =
                    radius + Math.sin(Math.PI * t) * maxElevation;
                points.push(p.multiplyScalar(currentRadius));
            }
            return points;
        };

        const createFlowingLineMaterial = (
            colorHex: string,
            scaleMult: number,
            direction: number,
            speed: number
        ) => {
            return new ShaderMaterial({
                uniforms: {
                    uColor: { value: new Color(colorHex) },
                    uTime: { value: 0 },
                    uDashSize: { value: 0.08 * scaleMult },
                    uGapSize: { value: 0.06 * scaleMult },
                    uSpeed: { value: speed },
                    uDirection: { value: direction },
                    uBaseOpacity: { value: 0.85 },
                    uPulseOpacity: { value: 1.0 },
                },
                vertexShader: `
                    attribute float lineDistance;
                    varying float vLineDistance;
                    void main() {
                        vLineDistance = lineDistance;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform vec3 uColor;
                    uniform float uTime;
                    uniform float uDashSize;
                    uniform float uGapSize;
                    uniform float uSpeed;
                    uniform float uDirection;
                    uniform float uBaseOpacity;
                    uniform float uPulseOpacity;
                    varying float vLineDistance;

                    void main() {
                        float totalDash = uDashSize + uGapSize;
                        float dist = vLineDistance - (uTime * uSpeed * uDirection);
                        float dash = mod(dist, totalDash);
                        if (dash < 0.0) {
                            dash += totalDash;
                        }

                        float pulse = 0.0;
                        if (dash <= uDashSize) {
                            float norm = dash / uDashSize;
                            pulse = pow(sin(norm * 3.14159265), 1.5);
                        }

                        vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), pulse * 0.75);
                        float alpha = (0.2 + pulse * 0.8) * uBaseOpacity * uPulseOpacity;
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,
                transparent: true,
                blending: AdditiveBlending,
                depthWrite: false,
            });
        };

        const setupNetworkArcs = () => {
            while (networkArcsGroup.children.length > 0) {
                networkArcsGroup.remove(networkArcsGroup.children[0]);
            }
            animatedShaderArcs.length = 0;

            const dcPos = latLngToPosition(WASHINGTON_DC.lat, WASHINGTON_DC.lng);
            const startVec = new Vector3(
                dcPos.x * globeRadius,
                dcPos.y * globeRadius,
                dcPos.z * globeRadius
            );

            WORLD_CAPITALS.forEach((capital, index) => {
                const destPos = latLngToPosition(capital.lat, capital.lng);
                const endVec = new Vector3(
                    destPos.x * globeRadius,
                    destPos.y * globeRadius,
                    destPos.z * globeRadius
                );

                // Generate exact Great Circle arc points connecting DC to Capital
                const points = createGreatCircleArcPoints(
                    startVec,
                    endVec,
                    globeRadius,
                    100
                );

                // Underlying solid guide arc line ensuring permanent connection
                const guideGeometry = new BufferGeometry().setFromPoints(points);
                const guideMat = new LineDashedMaterial({
                    color: new Color("#D5991C"),
                    dashSize: 100,
                    gapSize: 0,
                    transparent: true,
                    opacity: 0.35,
                });
                const guideLine = new Line(guideGeometry, guideMat);
                guideLine.computeLineDistances();
                networkArcsGroup.add(guideLine);

                // Create bidirectional flowing vector streams
                const directions = [-1, 1];
                directions.forEach((dir, dIdx) => {
                    const lineGeometry = new BufferGeometry().setFromPoints(points);

                    // Warm amber and champagne gold palette for flowing data vectors
                    const vectorColors = ["#D5991C", "#F2D69D", "#FBF3E2", "#E8B244"];
                    const chosenColor = vectorColors[(index + dIdx) % vectorColors.length];
                    const speed = 0.16 + (index % 4) * 0.04;

                    const lineMat = createFlowingLineMaterial(
                        chosenColor,
                        scaleMultiplier,
                        dir,
                        speed
                    );

                    const line = new Line(lineGeometry, lineMat);
                    line.computeLineDistances();
                    networkArcsGroup.add(line);

                    animatedShaderArcs.push({
                        material: lineMat,
                        phase: index * 0.6 + dIdx * Math.PI,
                        pulseFreq: 1.1 + (index % 3) * 0.3,
                    });
                });
            });
        };

        const loadWorldData = async () => {
            try {
                setIsLoading(true);
                const landFeatures = await getLandFeatures();

                while (continentOutlineGroup.children.length > 0) {
                    continentOutlineGroup.remove(
                        continentOutlineGroup.children[0]
                    );
                }
                if (showOutline && outlineColor && outlineRgba.a > 0) {
                    const outlineColorObj = new Color(resolvedOutlineColor);
                    const outlineMaterial = new MeshBasicMaterial({
                        color: outlineColorObj,
                        transparent: outlineRgba.a < 1,
                        opacity: outlineRgba.a,
                        depthTest: true,
                        depthWrite: true,
                    });
                    const projection = geoEquirectangular();
                    const pathGenerator = geoPath().projection(projection);
                    let processedCount = 0;
                    let skippedCount = 0;
                    landFeatures.features.forEach((feature: any) => {
                        const featureType =
                            feature.properties?.featurecla ||
                            feature.properties?.type ||
                            "";
                        const featureName = feature.properties?.name || "";
                        if (
                            featureType.toLowerCase().includes("graticule") ||
                            featureType.toLowerCase().includes("grid") ||
                            featureType.toLowerCase().includes("line") ||
                            featureName.toLowerCase().includes("graticule") ||
                            featureName.toLowerCase().includes("grid") ||
                            featureName.toLowerCase().includes("line")
                        ) {
                            skippedCount++;
                            return;
                        }
                        processedCount++;
                        const pathString = pathGenerator(feature);
                        if (!pathString) return;
                        const commands = pathString.match(/[ML][^MLZ]*/g) || [];
                        if (commands.length === 0) return;

                        const geometry = feature.geometry;
                        if (!geometry || !geometry.coordinates) return;

                        const processRing = (ring: number[][]) => {
                            if (ring.length < 2) return;
                            const simplifiedRing = simplifyRing(ring, detail);
                            const positions: number[] = [];
                            simplifiedRing.forEach((coord) => {
                                const [lng, lat] = coord;
                                const pos = latLngToPosition(lat, lng);
                                positions.push(
                                    pos.x * globeRadius,
                                    pos.y * globeRadius,
                                    pos.z * globeRadius
                                );
                            });
                            if (positions && positions.length >= 6) {
                                const points: Vector3[] = [];
                                for (let i = 0; i < positions.length; i += 3) {
                                    points.push(
                                        new Vector3(
                                            positions[i],
                                            positions[i + 1],
                                            positions[i + 2]
                                        )
                                    );
                                }
                                if (
                                    points.length > 0 &&
                                    points[0].distanceTo(
                                        points[points.length - 1]
                                    ) > 0.001
                                ) {
                                    points.push(points[0].clone());
                                }
                                if (points.length >= 2) {
                                    const curve = new CatmullRomCurve3(points);
                                    const radius = (outlineWidth / 10) * 0.01;
                                    const tubeGeometry = new TubeGeometry(
                                        curve,
                                        points.length * 2,
                                        radius,
                                        8,
                                        false
                                    );
                                    const tubeMesh = new Mesh(
                                        tubeGeometry,
                                        outlineMaterial
                                    );
                                    tubeMesh.renderOrder = 0;
                                    continentOutlineGroup.add(tubeMesh);
                                }
                            }
                        };
                        if (
                            geometry.type === "Polygon" &&
                            geometry.coordinates.length > 0
                        ) {
                            processRing(geometry.coordinates[0]);
                        } else if (geometry.type === "MultiPolygon") {
                            geometry.coordinates.forEach((polygon: any) => {
                                if (polygon.length > 0) {
                                    processRing(polygon[0]);
                                }
                            });
                        }
                    });
                    console.log(
                        `[Globe] Processed ${processedCount} land features, skipped ${skippedCount} grid features`
                    );
                }

                const bitmapWidth = 2048;
                const bitmapHeight = 1024;
                const offscreenCanvas = document.createElement("canvas");
                offscreenCanvas.width = bitmapWidth;
                offscreenCanvas.height = bitmapHeight;
                const ctx = offscreenCanvas.getContext("2d", {
                    willReadFrequently: true,
                });
                if (!ctx) throw new Error("Canvas not supported");
                const projection = geoEquirectangular().fitSize(
                    [bitmapWidth, bitmapHeight],
                    { type: "Sphere" } as any
                );
                const pathGenerator = geoPath()
                    .projection(projection)
                    .context(ctx);
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, bitmapWidth, bitmapHeight);
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                landFeatures.features.forEach((feature: any) => {
                    pathGenerator(feature);
                });
                ctx.fill();
                const imageData = ctx.getImageData(
                    0,
                    0,
                    bitmapWidth,
                    bitmapHeight
                );
                const pixels = imageData.data;
                const isOnLand = (lng: number, lat: number) => {
                    const x =
                        Math.round(((lng + 180) / 360) * bitmapWidth) %
                        bitmapWidth;
                    const y = Math.round(((90 - lat) / 180) * bitmapHeight);
                    const clampedY = Math.max(0, Math.min(bitmapHeight - 1, y));
                    const idx = (clampedY * bitmapWidth + x) * 4;
                    return pixels[idx] > 128;
                };

                if (fill === "solid") {
                    const texW = 1024;
                    const texH = 512;
                    const fillCanvas = document.createElement("canvas");
                    fillCanvas.width = texW;
                    fillCanvas.height = texH;
                    const fctx = fillCanvas.getContext("2d")!;
                    const img = fctx.createImageData(texW, texH);
                    const data = img.data;
                    const fr = Math.round(fillRgba.r * 255);
                    const fg = Math.round(fillRgba.g * 255);
                    const fb = Math.round(fillRgba.b * 255);
                    const fa = Math.round((fillRgba.a || 1) * 255);
                    for (let ty = 0; ty < texH; ty++) {
                        for (let tx = 0; tx < texW; tx++) {
                            const u = tx / texW;
                            const v = ty / texH;
                            let lng = (u - 0.25) * 360;
                            lng = ((((lng + 180) % 360) + 360) % 360) - 180;
                            const lat = (v - 0.5) * 180;
                            const onLand = allDots || isOnLand(lng, lat);
                            const idx = (ty * texW + tx) * 4;
                            if (onLand) {
                                data[idx] = fr;
                                data[idx + 1] = fg;
                                data[idx + 2] = fb;
                                data[idx + 3] = fa;
                            } else {
                                data[idx + 3] = 0;
                            }
                        }
                    }
                    fctx.putImageData(img, 0, 0);
                    const fillTexture = new CanvasTexture(fillCanvas);
                    fillTexture.flipY = false;
                    fillTexture.needsUpdate = true;
                    const fillGeometry = new SphereGeometry(
                        globeRadius * 1.002,
                        64,
                        64
                    );
                    const fillMaterial = new MeshBasicMaterial({
                        map: fillTexture,
                        transparent: true,
                    });
                    dotInstances = new Mesh(fillGeometry, fillMaterial);
                    globeGroup.add(dotInstances);
                } else {
                    const dotCoordinates: number[][] = [];
                    const baseStep = dotSpacing * 0.08;
                    for (let lat = -90; lat <= 90; lat += baseStep) {
                        const latRad = (Math.abs(lat) * Math.PI) / 180;
                        const cosLat = Math.cos(latRad);
                        const lngStep =
                            cosLat > 0.01
                                ? baseStep / Math.max(0.3, cosLat)
                                : 360;
                        for (let lng = -180; lng < 180; lng += lngStep) {
                            if (allDots || isOnLand(lng, lat)) {
                                dotCoordinates.push([lng, lat]);
                            }
                        }
                    }

                    if (dotCoordinates.length > 0) {
                        const dotGeometry = new SphereGeometry(
                            0.01 * dotSizeMultiplier,
                            4,
                            4
                        );
                        const dotColorObj = resolvedDotColor
                            ? new Color(resolvedDotColor)
                            : new Color(0.6, 0.6, 0.6);
                        const dotMaterial = new MeshBasicMaterial({
                            color: dotColorObj,
                            transparent: dotRgba.a < 1 || dotRgba.a === 0,
                            opacity: dotRgba.a,
                        });
                        const instanced = new InstancedMesh(
                            dotGeometry,
                            dotMaterial,
                            dotCoordinates.length
                        );
                        const matrix = new Matrix4();
                        for (let i = 0; i < dotCoordinates.length; i++) {
                            const [lng, lat] = dotCoordinates[i];
                            const pos = latLngToPosition(lat, lng);
                            matrix.makeScale(1, 1, 1);
                            matrix.setPosition(
                                pos.x * globeRadius,
                                pos.y * globeRadius,
                                pos.z * globeRadius
                            );
                            instanced.setMatrixAt(i, matrix);
                        }
                        instanced.instanceMatrix.needsUpdate = true;
                        dotInstances = instanced;
                        globeGroup.add(dotInstances);
                    }
                }

                updateMarkers();
                setupNetworkArcs();
                renderer.render(scene, camera);
                canvas.style.opacity = "1";
                canvas.style.visibility = "visible";
                setIsLoading(false);
            } catch (err) {
                console.warn("[Globe] Warning during world data setup, rendering fallback globe:", err);
                updateMarkers();
                setupNetworkArcs();
                renderer.render(scene, camera);
                canvas.style.opacity = "1";
                canvas.style.visibility = "visible";
                setIsLoading(false);
            }
        };

        const updateMarkers = () => {
            markerMeshes.forEach((mesh) => globeGroup.remove(mesh));
            markerMeshes = [];

            // Combine Washington DC, all network capitals, and any custom markers
            const rawMarkers = [
                WASHINGTON_DC,
                ...WORLD_CAPITALS,
                ...(markerConfig.markers || []),
            ];

            const uniqueMarkers: Marker[] = [];
            rawMarkers.forEach((m) => {
                if (!m || typeof m.lat !== "number" || typeof m.lng !== "number") return;
                const exists = uniqueMarkers.some(
                    (um) => Math.abs(um.lat - m.lat) < 0.1 && Math.abs(um.lng - m.lng) < 0.1
                );
                if (!exists) uniqueMarkers.push(m);
            });

            if (uniqueMarkers.length > 0) {
                const markerSize = 0.01 * markerRadiusMultiplier;
                const dcColorObj = new Color("#D5991C"); // Amber gold for Washington DC
                const dcGlowColorObj = new Color("#F2D69D"); // Soft champagne glow

                const destColorObj = new Color("#F2D69D"); // Champagne gold for connected nodes
                const destGlowColorObj = new Color("#D5991C");

                uniqueMarkers.forEach((marker) => {
                    const isDC =
                        Math.abs(marker.lat - WASHINGTON_DC.lat) < 0.1 &&
                        Math.abs(marker.lng - WASHINGTON_DC.lng) < 0.1;

                    const pos = latLngToPosition(marker.lat, marker.lng);
                    if (isDC) {
                        const dcMat = new MeshBasicMaterial({
                            color: dcColorObj,
                        });
                        const dcMesh = new Mesh(
                            new SphereGeometry(markerSize * 1.8, 16, 16),
                            dcMat
                        );
                        dcMesh.position.set(
                            pos.x * globeRadius,
                            pos.y * globeRadius,
                            pos.z * globeRadius
                        );
                        globeGroup.add(dcMesh);
                        markerMeshes.push(dcMesh);

                        // Soft glowing halo for DC
                        const glowMat = new MeshBasicMaterial({
                            color: dcGlowColorObj,
                            transparent: true,
                            opacity: 0.5,
                        });
                        const glowMesh = new Mesh(
                            new SphereGeometry(markerSize * 2.8, 16, 16),
                            glowMat
                        );
                        glowMesh.position.set(
                            pos.x * globeRadius,
                            pos.y * globeRadius,
                            pos.z * globeRadius
                        );
                        globeGroup.add(glowMesh);
                        markerMeshes.push(glowMesh);
                    } else {
                        // Destination nodes (Beijing, Moscow, London, Tokyo, etc.)
                        const mat = new MeshBasicMaterial({
                            color: destColorObj,
                        });
                        const markerMesh = new Mesh(
                            new SphereGeometry(markerSize * 1.3, 16, 16),
                            mat
                        );
                        markerMesh.position.set(
                            pos.x * globeRadius,
                            pos.y * globeRadius,
                            pos.z * globeRadius
                        );
                        globeGroup.add(markerMesh);
                        markerMeshes.push(markerMesh);

                        // Subtle outer glow halo for capital nodes
                        const glowMat = new MeshBasicMaterial({
                            color: destGlowColorObj,
                            transparent: true,
                            opacity: 0.35,
                        });
                        const glowMesh = new Mesh(
                            new SphereGeometry(markerSize * 2.1, 16, 16),
                            glowMat
                        );
                        glowMesh.position.set(
                            pos.x * globeRadius,
                            pos.y * globeRadius,
                            pos.z * globeRadius
                        );
                        globeGroup.add(glowMesh);
                        markerMeshes.push(glowMesh);
                    }
                });
            }
        };

        const initialLongitudeRad = (initialLongitude * Math.PI) / 180;
        const initialLatitudeRad = (initialLatitude * Math.PI) / 180;
        const rotation = { x: initialLongitudeRad, y: initialLatitudeRad };
        const targetRotation = {
            x: initialLongitudeRad,
            y: initialLatitudeRad,
        };
        const velocity = { x: 0, y: 0 };
        let isDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let animationFrameId: number | null = null;
        const lerpFactor =
            smoothingN === 0 ? 1 : mapLinear(smoothingN, 0, 1, 0.4, 0.03);
        const velocityDecay = mapLinear(smoothingN, 0, 1, 0.7, 0.96);

        const globeGroup = new Group();
        globeGroup.rotation.y = initialLongitudeRad;
        globeGroup.rotation.x = initialLatitudeRad;
        scene.add(globeGroup);
        globeGroup.add(oceanMesh);
        if (showGrid && graticuleColor && graticuleRgba.a > 0) {
            globeGroup.add(graticuleGroup);
        }
        globeGroup.add(continentOutlineGroup);
        globeGroup.add(networkArcsGroup);
        markerMeshes.forEach((mesh) => globeGroup.add(mesh));

        const animate = () => {
            let needsRender = false;
            const threshold = 0.01;

            // Continuous rotation regardless of hover
            if (!isDragging && rotationSpeed !== 0) {
                targetRotation.x += rotationSpeed * 0.01;
            }

            if (!isDragging && smoothingN > 0) {
                if (
                    Math.abs(velocity.x) > threshold ||
                    Math.abs(velocity.y) > threshold
                ) {
                    targetRotation.x += velocity.x;
                    targetRotation.y += velocity.y;
                    targetRotation.y = Math.max(
                        -Math.PI / 2,
                        Math.min(Math.PI / 2, targetRotation.y)
                    );
                    velocity.x *= velocityDecay;
                    velocity.y *= velocityDecay;
                } else {
                    velocity.x = 0;
                    velocity.y = 0;
                }
            }
            const dx = targetRotation.x - rotation.x;
            const dy = targetRotation.y - rotation.y;
            if (
                Math.abs(dx) > threshold ||
                Math.abs(dy) > threshold ||
                rotationSpeed !== 0 ||
                isDragging
            ) {
                rotation.x += dx * lerpFactor;
                rotation.y += dy * lerpFactor;
                rotation.y = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, rotation.y)
                );
                needsRender = true;
            }

            // Animate moving dashed lines that light up and fade continuously with high brightness
            const time = performance.now() * 0.001;
            animatedShaderArcs.forEach((arc) => {
                arc.material.uniforms.uTime.value = time;
                const wave = Math.sin(time * arc.pulseFreq + arc.phase);
                arc.material.uniforms.uPulseOpacity.value = 0.6 + 0.4 * (0.5 + 0.5 * wave);
            });
            needsRender = true;

            if (needsRender || rotationSpeed !== 0 || isDragging) {
                globeGroup.rotation.y = rotation.x;
                globeGroup.rotation.x = rotation.y;
                renderer.render(scene, camera);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        startAnimation();

        const handleMouseDown = (event: MouseEvent) => {
            isDragging = true;
            velocity.x = 0;
            velocity.y = 0;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            startAnimation();
            const handleMouseMoveDrag = (moveEvent: MouseEvent) => {
                const sensitivity = mapDragSpeedUiToSensitivity(dragSpeed);
                const dx = moveEvent.clientX - lastMouseX;
                const dy = moveEvent.clientY - lastMouseY;
                targetRotation.x += dx * sensitivity;
                targetRotation.y += dy * sensitivity;
                targetRotation.y = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, targetRotation.y)
                );
                velocity.x = dx * sensitivity * 0.3;
                velocity.y = dy * sensitivity * 0.3;
                lastMouseX = moveEvent.clientX;
                lastMouseY = moveEvent.clientY;
            };
            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMoveDrag);
                document.removeEventListener("mouseup", handleMouseUp);
                isDragging = false;
            };
            document.addEventListener("mousemove", handleMouseMoveDrag);
            document.addEventListener("mouseup", handleMouseUp);
        };
        canvas.addEventListener("mousedown", handleMouseDown);

        const resizeObserver = new ResizeObserver(() => {
            const newWidth =
                container.clientWidth || container.offsetWidth || 800;
            const newHeight =
                container.clientHeight || container.offsetHeight || 600;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            const aspect = newWidth / newHeight;
            const baseDistance = 2.65 / scaleMultiplier;
            const newCameraDistance = aspect < 1 ? baseDistance / Math.max(aspect, 0.5) : baseDistance;
            camera.position.set(0, 0, newCameraDistance);
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        });
        resizeObserver.observe(container);

        loadWorldData();

        return () => {
            if (animationFrameId !== null)
                cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener("mousedown", handleMouseDown);
            resizeObserver.disconnect();
            renderer.dispose();
            container.removeChild(canvas);
        };
    }, [
        speed,
        smoothing,
        dots.color,
        dots.size,
        dots.density,
        dots.allDots,
        fill,
        fillColor,
        scale,
        stopOnHover,
        markerConfig.color,
        markerConfig.size,
        direction,
        initialLatitude,
        initialLongitude,
        oceanColor,
        outlineColor,
        showOutline,
        graticuleColor,
        showGrid,
        outlineWidth,
        dragSpeed,
        detail,
        rotationSpeed,
        dotSpacing,
        dotSizeMultiplier,
        markerRadiusMultiplier,
        scaleMultiplier,
        arcColor,
        pulseColor,
    ]);

    const containerStyle: CSSProperties = {
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    if (error) {
        return (
            <div style={containerStyle}>
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        minWidth: 0,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        textAlign: "center",
                        padding: "16px",
                        fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    }}
                >
                    <div style={{ fontSize: "16px", fontWeight: 600 }}>
                        Error loading Earth visualization
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.7, marginTop: "4px" }}>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return <div ref={containerRef} style={containerStyle} />;
}
