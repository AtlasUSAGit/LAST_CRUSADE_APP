Every percentage in that section comes directly from three empirical 2026 industry studies cited in the research report: **Reach AI’s** analysis of 71,275 single-page AI citations across 43 brands (published October 23, 2026 by Ivan Nonveiller), **Semrush’s** study of domain appearances across AI search engines (published June 9, 2026 by Christine Skopec in partnership with Kevin Indig), and **Search Engine Land / Writesonic’s** analysis of 16 million AI brand appearances (published July 29, 2026).

Below is the exact source verification, including the raw numerator/denominator sample counts from the primary studies, followed by a transparent breakdown of which parts are verbatim empirical measurements versus which parts were parameterized for the simulator's mathematical formula.

---

## 1. Point-by-Point Source & Raw Data Verification

### A. Title-Tag Entity Suppression ($I_{\text{title}} = 0$)

* **Primary Source:** Ivan Nonveiller, *"Ghost Citations in 2026: Why AI Search Uses Your Content but Drops Your Name"*, **Reach AI** (`[https://usereach.ai/blog/ghost-citations](https://usereach.ai/blog/ghost-citations)`, October 23, 2026).
* **Dataset:** $n = 71,275$ AI citations to brands' own pages across ChatGPT, Perplexity, Google AI Mode, and Google AI Overviews.
* **Exact Numbers in the Study:**
* **Pooled Title-Tag Gap ($12.2\% \to 42.9\%$):** When the cited page did **not** have the brand name as a whole word in its HTML `<title>`, **42.9%** of citations were ghost citations (`28,264 of 65,810`). When the brand **was** in the `<title>`, the ghost rate dropped to **12.2%** (`665 of 5,465`)—a 30.7-percentage-point gap.
* **Within-Brand Statistical Significance ($p = 0.003$):** To ensure large brands weren't skewing the pooled average, Reach AI ran a within-brand test across 20 brands and found that brand-in-title pages were ghosted **60.3% less often**, holding across **17 of 20 brands ($p = 0.003$)**.
* **Per-Engine Breakdown (Untitled vs. Titled):**
* **ChatGPT:** **54.2%** ghost rate without brand in title vs. **18.8%** (`248 of 1,317`) with brand in title.
* **Perplexity:** **52.3%** (`8,834 of 16,902`) without brand in title vs. **12.6%** with brand in title.
* **Google AI Overviews:** **37.4%** without brand in title vs. **8.4%** (`132 of 1,580`) with brand in title.
* **Google AI Mode:** **33.9%** (`6,794 of 20,042`) without brand in title vs. **10.3%** (`173 of 1,677`) with brand in title.





---

### B. Unbranded Comparative Listicle Format ($I_{\text{listicle}} = 1$)

This bullet combines two separate empirical datasets—**Reach AI** (for the $49.5\%$ listicle ghost rate and $87\%$ substitution rate) and **Semrush** (for the $84.4\%$ commercial citation rate):

* **49.5% vs. 14.9% Listicle Ghost Rate (Reach AI, Oct 2026):** In Reach AI's page-type breakdown, `"Best X"` and comparison pages without the brand in the `<title>` had the highest ghost rate of any page type at **49.5%**, whereas adding the brand to the title of those comparison pages lowered the ghost rate to **14.9%** (and **11.0%** on non-listicle pages).
* **87% Target/Competitor Substitution Rate (Reach AI, Oct 2026):** In Reach AI's engine-level sample, **87% of ghost answers explicitly named other brands instead** of the brand whose page supplied the citation. As the authors state verbatim: *"87% of ghost answers named other brands instead. Your page did the work and a competitor got the credit."*
* **84.4% Commercial Query Citation Rate (Semrush, June 2026):** From Christine Skopec & Kevin Indig, *"Why 62% of AI citations don't lead to brand mentions [Study]"*, **Semrush** (`[https://www.semrush.com/blog/the-ghost-citations-study/](https://www.semrush.com/blog/the-ghost-citations-study/)`, June 9, 2026). Under Finding #7 (*"Informational queries trigger the most ghost citations"*), Semrush reports that **Commercial queries** (pricing, buying intent) generate an **84.4% citation rate** alongside a **35.6% mention rate**, while **Comparative queries** (`"best"`, `"vs"`, `"recommend"`) produce a **43.3% mention rate** ($2.4\times$ higher than informational queries).

---

### C. 500-Character Delay ($I_{\text{delay500}} = 1$) & Paragraph Decoupling ($\Delta_{\text{para}} \ge 3$)

This combines a quantitative finding from **Reach AI** with a qualitative/structural finding from **Search Engine Land (Writesonic study)**:

* **43.6% vs. 36.9% First 500 Characters (Reach AI, Oct 2026):** Reach AI tested whether placing the brand name in the opening $\sim 500$ characters affected ghosting. Pages **without** the brand in the first $\sim 500$ characters had a **43.6% ghost rate**, compared to **36.9%** when the brand appeared in the first $\sim 500$ characters (a 6.7-percentage-point gap).
* **Paragraph Decoupling & Generic Prose Anonymization (Search Engine Land / Writesonic, July 2026):** From *"Ghost citations: Why AI search cites your content, not your brand"* (`[https://searchengineland.com/ghost-citation-problem-ai-483794](https://searchengineland.com/ghost-citation-problem-ai-483794)`, July 29, 2026). The article explains how an AI model turns a branded statistic into generic prose: *"“One analysis found that approximately 40% of AI citations didn't name the source brand.” ... The hypothesis is that a statistic that appears a few paragraphs away from the company name that produced it is easier to anonymize than one where attribution [is bound in the same sentence]."*

---

### D. Boilerplate Mention Saturation ($I_{\text{mentions}\ge 10} = 1$)

* **Primary Source:** **Reach AI** (`[https://usereach.ai/blog/ghost-citations](https://usereach.ai/blog/ghost-citations)`, October 23, 2026, *"Finding 4: Repeating Your Brand Name Doesn't Help"*).
* **Exact Numbers in the Study:**
* **10+ Mentions:** Pages with 10 or more mentions of the brand name had the highest ghost rate of any group at **45.9%** (`22,387 of 48,732`).
* **3 to 9 Mentions:** Sat at **28.3%**, virtually identical to pages with **0 mentions** in the body copy (**27.8%**).



---

## 2. Audit Table: Verbatim Empirical Data vs. Mathematical Model Assumptions

To make sure you have zero ambiguity when using these numbers, the table below separates what is **strictly measured in the published studies** from how we **parameterized** those findings to build the interactive calculator:

| Claim / Variable in the Model | Strictly Verified in Published Study? | Exact Citation & Important Methodological Nuance |
| --- | --- | --- |
| **$12.2\% \to 42.9\%$ pooled ghost rate ($p = 0.003$)** | **Yes (100% Verbatim)** | **Reach AI (Oct 2026)**. `28,264 / 65,810` untitled vs. `665 / 5,465` titled; $60.3\%$ within-brand reduction across 17/20 brands ($p = 0.003$). |
| **ChatGPT ($18.8\% \to 54.2\%$), Perplexity ($12.6\% \to 52.3\%$), AIO ($8.4\% \to 37.4\%$), AI Mode ($10.3\% \to 33.9\%$)** | **Yes (100% Verbatim)** | **Reach AI (Oct 2026)** engine-level breakdown table. |
| **"**Zero loss in retrieval rank**" when omitting brand from `<title>**` | **Observational Inference (Caveat Applies)** | Reach AI's dataset (`71,275` citations) only measures pages **already cited** by AI engines (and notes that `65,810` of those `71,275` cited pages—$92.3\%$—did *not* have the brand in the title). However, Reach AI explicitly notes this is observational data across cited pages rather than a controlled pre/post ranking test. |
| **$49.5\%$ listicle ghost rate (vs. $14.9\%$ titled) & $87\%$ competitor substitution** | **Yes (100% Verbatim)** | **Reach AI (Oct 2026)**. Note: In the simulator, we fused Reach AI's $49.5\%$ listicle ghost rate with **Semrush's (June 2026)** $84.4\%$ commercial query citation rate. |
| **$43.6\%$ vs. $36.9\%$ ghost rate for omitting brand in first ~500 characters** | **Yes (100% Verbatim)** | **Reach AI (Oct 2026)**. Reach AI notes this is the smallest on-page lever they measured ($6.7$-point gap vs. $30.7$-point title gap). |
| **$45.9\%$ ghost rate for $10+$ mentions vs. $28.3\%$ for $3\text{–}9$ mentions (and $27.8\%$ for $0$)** | **Yes (100% Verbatim)** | **Reach AI (Oct 2026)** Finding #4 (`22,387 / 48,732`). Note: The explanation that RAG chunkers treat template repetitions as boilerplate is an architectural explanation of Reach AI's observational finding. |
| **$\Delta_{\text{para}} \ge 3$ ("at least 3 paragraphs away") & $\tanh(\Delta_{\text{para}}/3)$ formula** | **Mathematical Parameterization of Qualitative Finding** | **Search Engine Land / Writesonic (July 2026)** states qualitatively that a statistic placed *"a few paragraphs away from the company name that produced it is easier to anonymize"* into *"One analysis found..."*. Translating *"a few paragraphs away"* into $\Delta_{\text{para}} \ge 3$ and a logistic $\tanh(\Delta_{\text{para}}/3)$ curve is our mathematical modeling choice for the simulator, not a regression coefficient from Writesonic. |