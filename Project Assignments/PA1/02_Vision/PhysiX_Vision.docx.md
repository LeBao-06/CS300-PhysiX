# **PhysiX**

# **Vision Document**

# 

# **Version 1.0**

# 

# **Revision History**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 18/Oct/26 | 1.0 | Initial Vision Document for PA1, based on the PA0 proposal and preliminary user research. | Phy6 (Group 04\) |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

# **Table of Contents**

1\.	Introduction	4

2\.	Positioning	4

2.1	Problem Statement	4  
2.2	Product Position Statement	4

3\.	Stakeholder and User Descriptions	5

3.1	Stakeholder Summary	5  
3.2	User Summary	6  
3.3	User Environment	8  
3.4	Alternatives and Competition	9

4\.	Product Features	9

5\.	Non-Functional Requirements	11

# **Vision**

1. # **Introduction**

The purpose of this Vision Document is to collect and define the initial high-level needs and capabilities of PhysiX, a browser-based interactive 3D physics laboratory intended to complement physics teaching and physical experiments. It identifies the main user groups, the problems that motivate the product, the expected benefits, the principal features, and the quality requirements that should guide development.  
This is an initial PA1 document based on the Group 04 PA0 project proposal and the preliminary user research available at this stage. It describes the intended direction rather than a completed system: feature priorities, the initial feedback from students and teachers. This document does not revise or replace the PA0 proposal.

2. # **Positioning**

   1. ## **Problem Statement**

The following statement summarizes the problem that PhysiX is intended to address.

| The problem of | Students having limited opportunities to conduct or repeat hands-on physics experiments when laboratory apparatus, classroom time, or supporting resources are insufficient or unavailable. |
| :---- | :---- |
| affects | Secondary-school physics students, especially students studying independently, as well as physics teachers who need to demonstrate experimental procedures or provide supplementary practice. |
| the impact of which is | Students may have to rely heavily on explanations, diagrams, or demonstrations without being able to manipulate conditions, take their own measurements, and connect observed outcomes with the underlying physics. Teachers may also have difficulty arranging enough equipment and time for repeated practice. |
| a successful solution would be | A repeatable, interactive virtual laboratory that makes supported experiments easier to access, allows students to manipulate apparatus or parameters, provides understandable measurements and visual results, and complements rather than replaces physical laboratory work. |

2. ## **Product Position Statement**

PhysiX is positioned as a supplementary learning environment that combines guided curriculum experiments with an open-ended virtual laboratory space.

| For | Vietnamese secondary-school physics students and physics teachers who need accessible ways to explore or demonstrate selected experiments. |
| :---- | :---- |
| Who | Need to connect physics concepts to experimental actions and results, including opportunities to repeat trials and explore equipment when suitable physical apparatus or classroom time is limited. |
| The (product name) | PhysiX is a browser-based interactive 3D physics laboratory for educational use. |
| That | Offers a curriculum-organized experiment library with pre-arranged apparatus, alongside an open laboratory where users can browse, pick, and arrange supported apparatus for their own explorations. It also aims to support experiment controls, virtual measurements, result visualization, and optional contextual guidance. |
| Unlike | Textbook diagrams, pre-recorded videos, or simulations that support only a predefined interaction path. |
| Our product | Aims to combine ready-to-start curriculum experiments with free apparatus-based exploration in one 3D space. The degree of differentiation, learning benefit, and feasible initial scope will need to be validated during subsequent project iterations. |

3. # **Stakeholder and User Descriptions**

This section summarizes the groups with an interest in PhysiX, the intended users, their working environment, and the needs that justify the proposed features. PA0 research provides useful early signals but is limited in size and does not fully validate the needs of every intended grade range. The roles below describe anticipated project stakeholders and user groups; they do not imply that a school or institution has formally committed to deploying the product.

1. ## **Stakeholder Summary**

The following are non-end-user stakeholder groups with an interest in the project. Teachers who directly use PhysiX are described separately in Section 3.2.

| Name | Description | Responsibilities |
| :---- | :---- | :---- |
| Group 04 development team | The student team responsible for planning, designing, implementing, and evaluating PhysiX for CS300. | Defines a feasible scope; translates educational needs into features; maintains the code and project artifacts; verifies physics behavior and usability; tracks risks and progress. |
| CS300 course staff (instructor / teaching / assistants) | Academic stakeholders who review and assess the project deliverables and development process. | Provide feedback against course expectations; evaluate whether the team documents needs and scope clearly; identify areas that should be clarified in later assignments. |
| Schools / educational institutions (prospective) | Potential institutional adopters or contexts in which PhysiX could be used for supplementary learning or teacher-led demonstrations. No partner school has been confirmed in the materials reviewed for this document. | Would be interested in curriculum relevance, usability in available classrooms, low setup burden, appropriate handling of student information, and the ability to complement existing laboratory activities. |
| Physics content reviewers / educators | People with suitable physics and teaching expertise who may review supported experiment procedures, parameters, and explanations. | Check that modeled relationships and units are appropriate; flag misleading assumptions; review curriculum mapping and any AI-provided guidance before it is treated as instructional content. |

2. ## **User Summary**

PhysiX is intended for lower- and upper-secondary students in Vietnam, as well as physics teachers. However, the PA0 research provides the strongest direct evidence regarding the needs of high-school students and physics teachers. The specific needs of lower-secondary students have not yet been directly validated and require further investigation.

| Name | Description | Responsibilities | Stakeholder |
| :---- | :---- | :---- | :---- |
| Lower Secondary School Students | Potential target users of PhysiX whose specific needs have not yet been directly validated through the PA0 survey or interviews. They may benefit from age-appropriate, curriculum-aligned experiments with clear instructions and pre-configured apparatus. Their usability needs, preferred level of guidance, and suitability of open-ended laboratory activities require further investigation. | Access curriculum-listed experiments appropriate to their grade level, follow the stated objectives and instructions, observe simulated physical phenomena, interact with supported controls, and interpret basic measurements. Explore available apparatus in the Open Laboratory when the relevant activities are supported. | Physics teachers and schools / educational institutions; direct feedback from lower-secondary students is still needed. |
| High-School Students (Grade 10-12) | This is the student group most directly represented in the PA0 research. The preliminary survey included Grade 12 students and university students or former high-school physics learners, while the interviews included a Grade 12 physics student. The findings indicate limited opportunities for hands-on experimentation among respondents and interest in interactive 3D equipment, changing experimental parameters, repeating trials, and using virtual measuring instruments. Respondents also raised concerns about simulation accuracy and the reliability of AI guidance. These findings are preliminary and should not be generalized to all high-school students. | Access curriculum-related experiments, adjust supported experimental parameters, repeat trials, operate virtual measuring instruments, observe and compare results, and seek optional guidance when needed. Use the Open Laboratory to explore available apparatus and construct supported experimental setups independently. | Physics teachers and schools / educational institutions. |
| Physics teachers | Teachers who teach physics and may use PhysiX to support classroom demonstrations, guided student activities, and supplementary experimentation. PA0 interviews identified practical constraints such as outdated or damaged equipment, insufficient apparatus, large class sizes, and limited time for laboratory activities. The interviewed teachers also emphasized reliable measurements and the need for teacher oversight of AI-suggested equipment and experimental procedures. These findings reflect a limited interview sample. | Select curriculum-relevant experiments, demonstrate apparatus and experimental procedures, guide students in conducting virtual experiments, and help them interpret measurements and results. Review the scientific accuracy of simulated outcomes and any AI-suggested equipment or procedures before using them in teaching. | Schools / educational institutions and physics department; teachers are also direct users and stakeholders. |

3. ## **User Environment**

Physical Environment  
PhysiX is designed for use in three main settings: school computer laboratories, physics classrooms, and students’ homes. Students may use the application individually or work with classmates during a lesson. Teachers may also display an experiment on a classroom screen or projector to demonstrate a physical phenomenon. These environments may involve limited lesson time, shared equipment, or occasional distractions.  
Devices and Technology  
The primary devices are desktop and laptop computers running a modern web browser. Users will need a keyboard and mouse or trackpad to navigate the interface and manipulate virtual apparatus. The 3D laboratory is expected to require WebGL-compatible graphics hardware and sufficient computing resources. The initial PA1 scope prioritizes desktop and laptop use; full mobile and tablet support is not assumed.  
Users’ Technical Skills  
Students and teachers may have different levels of experience with educational software and 3D interfaces. Familiarity with everyday digital devices does not necessarily mean that users know how to manipulate virtual laboratory equipment. PhysiX should therefore provide clear labels, recognizable controls, visual feedback, and simple instructions. Beginners should be able to follow guided experiments, while more experienced users should be free to explore the Open Laboratory independently.  
Typical Usage  
In the Curriculum Experiment Library, students select an experiment, review its learning objective, and enter a 3D scene where the required apparatus is already prepared. In the Open Laboratory, students explore shelves or cabinets, select available apparatus, and arrange it on a workbench to investigate their own ideas. Both modes should provide clear measurement readings and allow users to reset or repeat an experiment when necessary. Important instructions and feedback should be available visually and through text rather than relying on audio alone.  
Connectivity and Operating Constraints  
An internet connection is expected to access the web application and remotely hosted resources. Network quality and computer performance may vary between schools and homes, so loading states and errors should be communicated clearly. Optional AI assistance may require an internet connection and a hosted AI service. However, users should be able to understand and operate the core experiment workflow without relying on AI assistance. Minimum hardware requirements and supported browser versions should be confirmed through testing.

4. ## **Alternatives and Competition**

Students and teachers can use several alternatives to support physics learning through experiments. Traditional physical laboratories provide hands-on experience with real equipment and allow students to observe physical phenomena directly. However, they require suitable facilities, sufficient apparatus, preparation, and supervision. Access to laboratory activities may also be limited by equipment availability and scheduled class time.  
Textbooks, classroom demonstrations, and online video resources are convenient ways to introduce physical concepts and explain experimental procedures. However, these resources generally provide limited opportunities for students to manipulate apparatus, modify experimental conditions, or investigate their own ideas through direct interaction.  
Interactive online physics simulations, such as PhET Interactive Simulations, allow learners to explore selected physical concepts by changing variables and observing the resulting behavior. Nevertheless, the available interaction depends on the design and scope of each simulation. A simulation focused on a particular concept may not provide an environment in which learners can freely select and arrange a wider range of apparatus to explore their own experimental questions.  
PhysiX is intended to complement these alternatives through two modes of learning. The Curriculum Experiment Library provides access to curriculum-related experiments with the required apparatus already arranged in the virtual laboratory, reducing the effort needed to prepare each activity. The Open Laboratory provides a more flexible 3D environment in which learners can explore available apparatus, select and arrange equipment, and investigate their own ideas. PhysiX is intended to make guided experimentation and independent exploration more accessible, rather than to replace the practical experience provided by physical laboratories.

4. # **Product Features**

PhysiX provides a browser-based 3D environment for learning physics through guided experiments and open-ended exploration. Its main features focus on helping learners access curriculum-related experiments, start experiments with prepared apparatus, and freely explore and arrange equipment in a virtual laboratory. The following table summarizes the proposed product features and their priorities.

| No. | Feature | Description | Priority |
| :---- | :---- | :---- | :---- |
| 1 | Curriculum Experiment Library | Browse a list of supported experiments grouped by THCS / THPT and, where validated, by textbook topic or learning objective. Each listing should show the experiment name and a concise objective or introduction. | High |
| 2 | Prepared Experiment Launch | Opening a library-listed experiment loads its ready-made laboratory scene with the required apparatus already placed on the table, so users do not need to find and select equipment manually. | High |
| 3 | Open Laboratory and Apparatus Exploration | Provide an open 3D lab area with shelves or cabinets of supported apparatus. Users can browse/search, inspect, pick up, move, and arrange equipment to try self-directed setups beyond predefined library entries. | High |
| 4 | Interactive 3D Scene | Let users view and interact with supported apparatus and modeled physical motion in a coherent 3D workspace. Selection and placement feedback should make spatial actions understandable. | High |
| 5 | Experiment Controls | Provide experiment-appropriate controls for supported parameters and actions such as start, pause/resume, reset, and repeat. Controls should show valid ranges and units where applicable. | High |
| 6 | Virtual Instruments and Measurements | Support appropriate virtual instruments (for example, a ruler, stopwatch, protractor, or electrical meter where relevant) and display measurements with understandable values and units. Availability depends on the chosen experiment. | High |
| 7 | Results and Visualization | Show the results needed to interpret a trial, such as measurement tables or simple plots where relevant. Where comparison is implemented, allow users to compare observations from repeated trials. | High |
| 8 | Optional Contextual AI Assistance | Provide on-demand explanations or procedural guidance for supported experiments and apparatus. The user remains in control; proposed apparatus or setup changes require confirmation, and AI output must not be presented as automatically verified physics truth. | Medium |
| 9 | Save / Export Observations | Allow basic observations or results to be saved or exported for later review, if time and implementation scope permit. The exact format and retention policy remain to be decided. | Low |
| 10 | Natural-Language Experiment Generation | The long-term proposal mentions translating free-form experiment descriptions into executable scenarios. This is not assumed to be part of the initial PA1 release because simulation validity and feasible scope require separate design and verification. | Low/Future |

5. # **Non-Functional Requirements**

The following non-functional requirements describe the expected quality attributes of PhysiX across its product features.  
\- Usability: The interface should make the two main modes easy to distinguish and navigate. Experiment names, apparatus labels, and available interactions should be presented clearly so that students can understand how to access a prepared experiment or begin exploring the Open Laboratory. Important actions should provide clear visual feedback.  
\- Browser Compatibility: PhysiX should operate in a modern web browser without requiring users to install a separate desktop application. The 3D laboratory should run on supported browsers and devices that meet the system's graphics requirements. The exact browser versions and minimum hardware specifications should be established through implementation and testing.  
\- Performance: The system should load the laboratory environment and respond to user interactions without disruptive delays under normal operating conditions. Initial performance targets should be validated on representative school computers and network connections before they are adopted as final acceptance criteria.  
\- Simulation Accuracy and Consistency: The simulated behavior of each supported experiment should be consistent with its intended physics model. Under the same initial conditions and parameter settings, the simulation should produce consistent results. Experiment behavior should be tested against appropriate reference calculations or expected physical outcomes.  
\- Reliability: The system should handle ordinary user interactions and changes to experimental setups without unexpected termination. Where supported, learners should be able to recover from an incorrectly arranged setup and restart an experiment without having to reload the entire application.  
\- Maintainability: The implementation should be organized so that supported experiments and apparatus can be updated or extended without requiring unnecessary changes to unrelated parts of the system.  
These requirements describe the intended quality of the initial product. Specific performance thresholds, supported devices, and other measurable acceptance criteria should be finalized according to the project's confirmed scope and tested operating environment.