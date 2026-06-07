---
title: "Responsible AI in 2026: Progress, Gaps and Tradeoffs"
date: 2026-06-06
draft: false
description: "Eight findings from the latest AI research cycle: hallucination rates remain high, transparency is declining, safety degrades under attack and governance is growing but underfunded."
tags: ["AI", "statistics", "2026", "governance", "safety", "privacy", "AI Incident Database", "AI models", "Organizations",  ]
math: true
---

Artificial intelligence has matured rapidly as a technical discipline, but the systems that govern its responsible use have not kept pace. The picture that emerges from 2025–2026 research is one of growing institutional awareness alongside persistent practical failure: more organizations have formal AI governance policies, yet knowledge gaps, budget constraints and regulatory uncertainty continue to slow implementation. Transparency among the major AI developers has declined sharply after a period of improvement. Models that pass safety evaluations under normal conditions show meaningful degradation when subjected to deliberate adversarial pressure. The fundamental tradeoffs between safety, fairness and privacy remain poorly understood even by the research community building these systems.

Responsible AI benchmarking is not keeping up with deployment. Almost all leading frontier model developers report results on capability benchmarks such as MMLU and SWE-bench, but reporting on responsible AI benchmarks remains sparse. Documented AI incidents continued to rise, with the AI Incident Database recording 362 incidents in 2025, up from 233 in 2024.

AI models struggle to tell the difference between knowledge and belief. A new accuracy benchmark found hallucination rates across 26 top models ranging from 22% to 94%. GPT-4o's accuracy dropped from 98.2% to 64.4% and DeepSeek R1 fell from over 90% to 14.4%. When a false statement is framed as something another person believes, models handle it reasonably well. When the same false statement is framed as something the user believes, performance collapses.

Organizations are formalizing responsible AI work, but gaps slow adoption. AI-specific governance roles grew 17% in 2025 and the share of businesses with no responsible AI policies in place fell sharply from 24% to 11%. The main obstacles to implementation remain gaps in knowledge (59%), budget constraints (48%) and regulatory uncertainty (41%).

The regulatory landscape is shifting toward AI-specific frameworks. GDPR remains the most cited regulatory influence but slipped from 65% in 2024 to 60% in 2025. New entries in 2025 include ISO/IEC 42001, an AI management system standard, cited by 36% of respondents and the NIST AI Risk Management Framework at 33%. The share of organizations reporting no regulatory influence at all fell from 17% to 12%.

AI works best in English and the gap is wider than global benchmarks suggest. On HELM Arabic, a regionally developed model for the Arabic language outscored GPT-5.1 and Gemini 2.5 Flash. The disparity widens further at the dialect level: on a Slovenian commonsense reasoning test, several leading models lost close to half their accuracy when tested in a regional dialect rather than the standard language.

AI companies grew less transparent this year. After rising on the Foundation Model Transparency Index from 37 to 58 between 2023 and 2024, the average score dropped to 40 in 2025. Major gaps persist in disclosure around training data, compute resources and post-deployment impact.

AI models perform well on safety tests under normal conditions, but their defenses weaken under deliberate attack. On the AILuminate benchmark, several frontier models received "Very Good" or "Good" safety ratings under standard use. When tested against jailbreak attempts using adversarial prompts, safety performance dropped across all models tested.

Safety, fairness and privacy are in tension and the tradeoffs are not well understood. Recent empirical studies found that training techniques aimed at improving one responsible AI dimension consistently degraded others. No widely accepted framework yet exists for navigating these tradeoffs in practice.

Key Figures at a Glance

AI Incidents

| Year | Incidents Recorded |
| ---- | ------------------ |
| 2024 | 233                |
| 2025 | 362                |

Hallucination and Accuracy

| Metric                                        | Value    |
| --------------------------------------------- | -------- |
| Hallucination rate range across 26 top models | 22%–94%  |
| GPT-4o accuracy (baseline)                    | 98.2%    |
| GPT-4o accuracy (user-belief framing)         | 64.4%    |
| DeepSeek R1 accuracy (baseline)               | 90%+     |
| DeepSeek R1 accuracy (user-belief framing)    | 14.4%    |

Governance

| Metric                                              | Value |
| --------------------------------------------------- | ----- |
| AI-specific governance role growth (2025)           | +17%  |
| Businesses with no responsible AI policies (2024)   | 24%   |
| Businesses with no responsible AI policies (2025)   | 11%   |

Obstacles to Responsible AI Adoption

| Obstacle               | Share |
| ---------------------- | ----- |
| Knowledge gaps         | 59%   |
| Budget constraints     | 48%   |
| Regulatory uncertainty | 41%   |

Regulatory Influence

| Framework               | 2024 | 2025 |
| ----------------------- | ---- | ---- |
| GDPR                    | 65%  | 60%  |
| ISO/IEC 42001           | n/a  | 36%  |
| NIST AI RMF             | n/a  | 33%  |
| No regulatory influence | 17%  | 12%  |

Foundation Model Transparency Index

| Year | Average Score |
| ---- | ------------- |
| 2023 | 37            |
| 2024 | 58            |
| 2025 | 40            |

---
*Sources: AI Incident Database, AILuminate benchmark, Foundation Model Transparency Index, HELM Arabic, Stanford AI Index 2026, hai.stanford.edu*
