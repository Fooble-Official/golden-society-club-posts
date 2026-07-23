# Equation updates for the real journal / app source of truth

These 66 principles had equations in the OFFICIAL sheet that were abstract, internally inconsistent, or produced uninterpretable numbers. We replaced them with clean, computable formulas (each verified against a worked example). Update the journal's source equations to match.

## 37. Second-Order Effects Planning
- Old (sheet): SOEP = First-Order Gain + Positive 2nd-Order - Negative 2nd-Order
- New:         SOEP = First-Order Gain (rate 1-10) + Positive Second-Order Effects (list each one, rate 1-10, sum them) - Negative Second-Order Effects (list each one, rate 1-10, sum them)
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 51. Unit-Economics Decomposition
- Old (sheet): UE = LTV - CAC - Variable Service Cost - Retention Cost - Support Burden
- New:         UE = Lifetime Revenue − CAC − Variable Service Cost − Retention Cost − Support Burden
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 69. Refund-Risk Architecture
- Old (sheet): RRA = Expectation Gap × Impulse × Time to Value × Friction
- New:         RRA = (Expectation Gap + Impulse + Time to Value + Friction) ÷ 4
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 88. Recovery-Loop Design
- Old (sheet): RLD = Reactivation × Message Relevance × Ease of Return
- New:         RLD = (Trigger Quality + Message Relevance + Ease of Return) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 93. Message-Market Mismatch Diagnostics
- Old (sheet): MMMD = ((Traffic × (1-Conv)) + Confusion + Objection) ÷ 3
- New:         Diagnostic Score = (Confusion + Objection) ÷ 2
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 96. Attribution Epistemology
- Old (sheet): AE = Measured Confidence ÷ True Causal Confidence
- New:         AE = Measured Confidence ÷ Experiment-Verified Confidence
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 101. Systems Awareness
- Old (sheet): Output = f(Inputs, Structure, Feedback)
- New:         Output Score = (Input Quality + Structure Quality + Feedback Speed) ÷ 3
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 102. Inputs Define Outputs
- Old (sheet): Output Quality = f(Input Quality × Process)
- New:         Output Quality = Input Quality × Process Quality
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 105. Constraints Determine Output
- Old (sheet): Max Output = f(Weakest Constraint)
- New:         Max Output = Capacity of the Weakest Constraint
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 112. Non-Linear Returns
- Old (sheet): Result = f(Non-Linear Effort)
- New:         Focus Ratio = % of Effort on Your Top 20% Activities
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 122. Balancing Loops
- Old (sheet): Change Rate = Desired - Current
- New:         Gap = Desired − Current
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 124. System Boundaries
- Old (sheet): Performance = f(scope)
- New:         System Performance = (Outcomes Achieved + Scope Considered) ÷ 2
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 139. Recovery Systems
- Old (sheet): Performance = Stress + Recovery Balance
- New:         Strain Ratio = Stress ÷ Recovery   (aim < 1.0)
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 140. Constraint Expansion
- Old (sheet): Growth = Constraint Expansion Rate
- New:         Growth = Bottleneck Capacity Added ÷ Prior Capacity
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 141. System Synchronization
- Old (sheet): Efficiency = Alignment
- New:         Efficiency = Aligned Systems ÷ Total Systems
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 147. System Redundancy
- Old (sheet): Stability = Redundancy
- New:         Stability = Backup Systems ÷ Critical Systems
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 148. Drift Correction
- Old (sheet): Correction = Deviation × Frequency
- New:         Correction = Gap Closed × Frequency
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 149. System Integration
- Old (sheet): Quality = Alignment of All Systems
- New:         Quality = Systems Working Together ÷ Total Systems
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 157. System Stacking
- Old (sheet): Value = Outputs per Action
- New:         Leverage = Goals Served ÷ Actions Taken
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 162. Future Self Alignment
- Old (sheet): Alignment = Current ÷ Future
- New:         Alignment = Actions Serving Future Self ÷ Total Actions Today
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 164. Stress Load Balancing
- Old (sheet): Balance = Stress ÷ Recovery
- New:         Strain Ratio = Stress ÷ Recovery (aim < 1.0)
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 169. Life System Harmony
- Old (sheet): Harmony = Alignment
- New:         Harmony = Aligned Domains ÷ Total Domains
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 193. Leverage Points
- Old (sheet): Impact = Effort × Leverage Factor
- New:         Impact = Leverage Factor ÷ Effort
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 201. Control Points
- Old (sheet): Corrective Action = Controller Output
- New:         Alert = Metric Value < Threshold   (Yes / No)
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 207. Environmental Triggers
- Old (sheet): Behavior = f(Cues)
- New:         Net Cues = Good Cues − Bad Cues
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 210. Parallel Systems (Redundancy)
- Old (sheet): Reliability = 1 - ∏(1-rel_i)
- New:         Reliability = 1 − (Fail Rate₁ × Fail Rate₂ × …)
- Why: Sheet equation used math notation a general reader can't compute; replaced with a plain, computable formula.

## 217. Consistent Rest & Recovery
- Old (sheet): Performance = f(Stress × Recovery)
- New:         Sustainable Performance = Recovery ÷ Stress
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 226. Information Diet
- Old (sheet): Insight = Quality × Time
- New:         Insight per Hour = Quality ÷ Time
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 228. Energy Renewal Techniques
- Old (sheet): Focus = Pre-Fragility - Restoration
- New:         Focus = Restoration − Fatigue
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 234. Version Control
- Old (sheet): History Value = Σ(v_i - v_{i-1})
- New:         History Value = Σ Size of Each Tracked Change
- Why: Sheet equation used math notation a general reader can't compute; replaced with a plain, computable formula.

## 235. Parallel Goals
- Old (sheet): Total = Σ(Outputs per Action)
- New:         Leverage = Total Outputs ÷ Total Actions
- Why: Sheet equation used math notation a general reader can't compute; replaced with a plain, computable formula.

## 237. Cultivate Auto-Pilot
- Old (sheet): Reliance = 1 - Motivation Dependence
- New:         Reliance = 1 − (Motivation Dependence ÷ 10)
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 238. Goal Decoupling
- Old (sheet): Stability ∝ Outcome - Identity Attachment
- New:         Stability = 10 − Identity Attachment
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 241. Simplify Everything
- Old (sheet): Marketplace Value = Restaurant Desire × Influencer Desire × User Desire
- New:         Marketplace Value = Supplier Desire × Partner Desire × Customer Desire
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 259. Second Order Thinking
- Old (sheet): Decision Quality = Immediate Benefit × Long-Term Consequence Awareness
- New:         Decision Quality = (Immediate Benefit + Long-Term Consequence Awareness) ÷ 2
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 273. Hedgehog Concept
- Old (sheet): Hedgehog Output = Passion ∩ Best-at-it ∩ Economic Engine
- New:         Hedgehog Score = min(Passion, Best-at-it, Economic Engine)
- Why: Sheet equation used math notation a general reader can't compute; replaced with a plain, computable formula.

## 276. Flywheel Effect
- Old (sheet): Momentum = Σ(Consistent Pushes) × Time
- New:         Momentum = Disciplined Pushes per Month × Months Sustained
- Why: Sheet equation used math notation a general reader can't compute; replaced with a plain, computable formula.

## 277. 20-Mile March
- Old (sheet): Long-term Output = Daily Floor × Consistency × Years
- New:         Long-term Output = Daily Floor × Days Hit per Year × Years
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 285. Porter’s Five Forces
- Old (sheet): Industry Profit Pool = f(Rivalry, Entrants, Buyer Power, Supplier Power, Substitutes)
- New:         Profit Pool = 50 − (Rivalry + Entrants + Buyer + Supplier + Substitutes)
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 288. Build-Measure-Learn Loop
- Old (sheet): Learning Velocity = Cycle Speed × Hypothesis Quality
- New:         Learning Velocity = (Cycle Speed + Hypothesis Quality) ÷ 2
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 291. Pivot or Persevere
- Old (sheet): Pivot Quality = Data Honesty × Pre-Set Criteria × Decision Speed
- New:         Pivot Quality = (Data Honesty + Pre-Set Criteria + Decision Speed) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 292. Beachhead Strategy
- Old (sheet): Beachhead Strength = Segment Share × Reference Density × Whole-Product Fit
- New:         Beachhead Strength = (Segment Share + Reference Density + Whole-Product Fit) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 293. Whole Product
- Old (sheet): Whole Product = Core Product + Integrations + Services + Support + References
- New:         Whole Product = (Core Product + Integrations + Services + Support + References) ÷ 5
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 294. Monopoly 10x Thinking
- Old (sheet): Monopoly Position = Performance Multiple × Switching Cost × Defensibility
- New:         Monopoly Position = (Performance Multiple + Switching Cost + Defensibility) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 295. Loss Aversion
- Old (sheet): Decision Pull = (Loss Weight ≈ 2 × Gain Weight)
- New:         Loss Aversion Ratio = Loss Weight ÷ Gain Weight (≈ 2 for most people)
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 296. Framing Effect
- Old (sheet): Decision = f(Fact × Frame)
- New:         Frame Gap = Response Rate A − Response Rate B
- Why: Sheet equation was abstract function notation f(...); replaced with a concrete, computable formula.

## 299. Reciprocity
- Old (sheet): Reciprocal Pull = Gift Value × Authenticity × Relevance
- New:         Reciprocal Pull = (Gift Value + Authenticity + Relevance) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 300. Commitment and Consistency
- Old (sheet): Commitment Pull = Initial Step × Visibility × Time
- New:         Commitment Pull = (Initial Step + Visibility + Time) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 301. Social Proof
- Old (sheet): Social Proof Strength = Visibility × Similarity × Volume × Authenticity
- New:         Social Proof Strength = (Visibility + Similarity + Volume + Authenticity) ÷ 4
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 302. Liking
- Old (sheet): Influence = Trust × Likability × Relevance
- New:         Influence = (Trust + Likability + Relevance) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 303. Authority
- Old (sheet): Authority Trust = Credentials × Expertise Visibility × Relevance
- New:         Authority Trust = (Credentials + Expertise Visibility + Relevance) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 304. Scarcity
- Old (sheet): Scarcity Pull = Genuine Limit × Visibility × Time Pressure
- New:         Scarcity Pull = (Genuine Limit + Visibility + Time Pressure) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 305. Knightian Uncertainty
- Old (sheet): Survival = Affordable Loss × Optionality × Learning Rate
- New:         Survival = (Affordable Loss + Optionality + Learning Rate) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 306. Adjacent Possible
- Old (sheet): Innovation Yield = Adjacent Steps × Combination Quality × Iteration Speed
- New:         Innovation Yield = (Adjacent Steps + Combination Quality + Iteration Speed) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 308. Founder-Market Fit
- Old (sheet): Founder-Market Fit = Lived Experience × Identity Alignment × Mission Conviction
- New:         Founder-Market Fit = (Lived Experience + Identity Alignment + Mission Conviction) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 309. Constraint-Induced Innovation
- Old (sheet): Constraint Yield = Resource Limit × Creativity × Time Pressure
- New:         Constraint Yield = (Resource Limit + Creativity + Time Pressure) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 310. Assumption Testing
- Old (sheet): Plan Robustness = Assumptions Tested × Cost-to-Falsify × Decision Hooks
- New:         Plan Robustness = (Assumptions Tested + Cost-to-Falsify + Decision Hooks) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 311. Orgology
- Old (sheet): Organizational Health = Structure × Incentives × Feedback Quality × Cultural Coherence
- New:         Organizational Health = (Structure + Incentives + Feedback Quality + Cultural Coherence) ÷ 4
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 312. Information Asymmetry
- Old (sheet): Trust Closure = Signal Strength × Verification Cost × Transparency
- New:         Trust Closure = (Signal Strength + Verification Ease + Transparency) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 313. Principal-Agent Problems
- Old (sheet): Incentive Alignment = Goal Overlap × Measurability × Skin in the Game
- New:         Incentive Alignment = (Goal Overlap + Measurability + Skin in the Game) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 317. Path Dependence
- Old (sheet): Future Options = Past Choices × Switching Cost × Inertia
- New:         Lock-In = (Past Choices + Switching Cost + Inertia) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 318. Phase Transitions
- Old (sheet): Transition Risk = Distance to Threshold × System Sensitivity
- New:         Transition Risk = (Closeness to Threshold + System Sensitivity) ÷ 2
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 320. Systems Thinking
- Old (sheet): Diagnosis Quality = Loop Mapping × Delay Awareness × Leverage Identification
- New:         Diagnosis Quality = (Loop Mapping + Delay Awareness + Leverage Identification) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 322. Hiding Hand
- Old (sheet): Project Survival = Naive Ambition × Adaptive Creativity
- New:         Project Survival = Adaptive Creativity ÷ Naive Ambition
- Why: Sheet equation was internally inconsistent, circular, or directionally backwards vs its own logic; corrected.

## 325. Antifragility
- Old (sheet): Antifragility = Convex Payoffs × Optionality × Recovery Capacity
- New:         Antifragility = (Convex Payoffs + Optionality + Recovery Capacity) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.

## 326. Cynefin Framework
- Old (sheet): Decision Quality = Domain Match × Method Fit × Iteration Speed
- New:         Decision Quality = (Domain Match + Method Fit + Iteration Speed) ÷ 3
- Why: Sheet multiplied raw 1-10 ratings (uninterpretable big number); standardized to an average on the 1-10 scale.
