# **PhysiX**

# **Vision Document**

# 

# **Version 2.1**

# 

# **Revision History**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 18/Oct/26 | 1.0 | Initial Vision Document for PA1, based on the PA0 proposal and preliminary user research. | Phy6 (Group 04\) |
| 26/Oct/26 | 1.1 | Expanded Section 5 with measurable accuracy, performance, usability, and reliability criteria. | NVLBao |
| 26/Oct/2026 | 1.2 | Significantly revised Sections 3.2, 3.3, 3.4, and 4 to incorporate PA2 scope refinements. Detailed task analysis for user environments, established strict WebGL/Desktop hardware constraints, expanded competitive analysis, and mapped finalized Product Features directly to Use Cases (UC01–UC06).  | VQLinh |
| 30/Oct/26 | 1.3 | Revised Sections 1, 2.1, 2.2, 3.2, 3.3, 3.4, and 4 to clarify target users, student and teacher needs, usage scenarios, user environments, competitor positioning, and proposed product features. Added evidence-based competitor comparison and provisional feature-to-Use-Case traceability. | VQLinh |
| 01/Nov/26 | 1.4 | Rewrote Section 5 (Non-Functional Requirements) per TA feedback: added a verifiable usability acceptance checklist; specified supported operating systems and minimum browser versions with screenshot evidence; defined performance targets per feature group; added verification methods for reliability, maintainability, and physics consistency; moved experiment-specific accuracy requirements to the corresponding features and Guided Use Cases; removed Projectile Motion. | NVLBao |
| 01/Nov/26 | 2.0 | Rewrote the document for customer readers (schools, physics departments, teachers). Section 1: new purpose and scope (Grades 6-12, Guided Experiments and Open Lab). Section 2: replaced the shared problem statement with a school-focused problem statement; added a school product position; corrected the teacher position heading. Section 3: replaced project-internal stakeholders with schools, physics department heads, the physics content expert, parents, the national curriculum and Phy6; added age, usage frequency and experience to user groups; added other applications to the user environment; rewrote the competitor analysis as text to follow the template. Section 4: nine features mapped one-to-one to use cases UC01-UC09, with experiment-specific parameters and accuracy for Simple Pendulum and Ohm’s Law. Section 5: acceptance by the school representative; added interface language, availability and capacity, security and privacy, documentation and help, design constraints and dependencies, and NFR priorities; converted tables to lists to follow the template. | VQLinh, DTTKhoi  |
| 08/Nov/26  | 2.1  | Feature 3 (Simple Pendulum): stated the simulation model and its assumptions; aligned the completion rule with UC03.1.2 and UC03.1.4 (six trials in three controlled pairs). Updated the page header to the current version.  | NVLBao |

# **Table of Contents**

1\.	Introduction	5

2\.	Positioning	5

2.1	Problem Statement	5  
2.2	Product Position Statement	6

3\.	Stakeholder and User Descriptions	8

3.1	Stakeholder Summary	8  
3.2	User Summary	8  
3.3	User Environment	11  
3.4	Alternatives and Competition	11

4\.	Product Features	12

5\.	Non-Functional Requirements	15

# **Vision**

1. # **Introduction**

The purpose of this Vision document is to define the high-level needs and features of PhysiX, a web-based 3D virtual physics laboratory for Vietnamese students in Grades 6-12 and their teachers. It explains who uses PhysiX, which problems it solves for them, which features it provides and the quality levels it must meet. How each feature behaves step by step is described in the PhysiX Use-Case Specification.

PhysiX lets students carry out physics experiments in a virtual laboratory on a computer. It offers two laboratory modes. In Guided Experiments, a student chooses an experiment from the textbooks of the national General Education Programme 2018 (GDPT 2018), finds the required apparatus already set up on the bench, and follows step-by-step instructions shown on the right side of the screen. In Open Lab, a student opens an apparatus drawer, takes out any apparatus and builds their own setup. In both modes, students read values from virtual instruments, record trials in a data table, view graphs and ask an AI lab assistant for explanations.

This document is written for schools and physics departments considering PhysiX, for the teachers and students who will use it, for the physics content expert who reviews its scientific content, and for the Phy6 team that builds and operates the product.

2. # **Positioning**

   1. ## **Problem Statement**

The following statements summarize the problems PhysiX addresses for students, teachers and schools.

1. **Student-focused Problem Statement**

| The problem of | Students rarely carry out physics experiments themselves. School laboratories often lack working apparatus or laboratory time, and an experiment seen in class cannot be repeated at home. |
| :---- | :---- |
| affects | Students in Grades 6-12 who study physics (within Natural Science in Grades 6-9 and Physics in Grades 10-12), especially those at schools with limited laboratory equipment and those who study at home. |
| the impact of which is | Students memorize formulas without seeing how changing a condition changes the result. In a survey of 25 learners, 84% had done no more than two hands-on physics experiments in their most recent year of physics. Students also get little practice in reading instruments, recording data and drawing conclusions from repeated measurements. |
| a successful solution would be | A virtual laboratory that students can open in a web browser at school or at home, in which they set up and run textbook experiments, change conditions, read instruments, repeat trials as often as they need and see the results in tables and graphs. |

2. **Teacher-focused Problem Statement**

| The problem of | Teachers cannot demonstrate or run every experiment in the curriculum, because the apparatus is missing, broken or inaccurate, and preparing a practical lesson takes time. |
| :---- | :---- |
| affects | Physics and Natural Science teachers in lower- and upper-secondary schools, often teaching classes of around 40 students. |
| the impact of which is | Some experiments are only explained in words or shown on video. In large classes, not every student can see the apparatus or take part. Teachers we interviewed reported old or broken meters, too few electrical kits, and students connecting ammeters and voltmeters incorrectly, all of which slow down practical lessons. |
| a successful solution would be | A ready-to-use virtual experiment that the teacher can open in front of the class on a projector, run step by step, repeat with different conditions and explain using live readings, data tables and graphs, without preparing physical apparatus. |

3. **School-focused Problem Statement**

| The problem of | Equipping and maintaining a physics laboratory for every experiment in the GDPT 2018 curriculum is costly, and the apparatus wears out or breaks. |
| :---- | :---- |
| affects | Lower- and upper-secondary schools, their leadership and their physics departments. |
| the impact of which is | Schools cannot give every class regular practical work, so the quality of practical physics teaching depends on each school’s budget and facilities. |
| a successful solution would be | A web-based laboratory that runs on the school’s existing computers without installation, covers textbook experiments, and complements rather than replaces the real experiments the school can provide. |

   2. ## **Product Position Statement**

PhysiX is a web-based 3D physics laboratory organized around the Vietnamese physics textbooks. The statements below describe its position for students, teachers and schools.

1. **Student Product Position**

| For | Students in Grades 6-12 in Vietnam |
| :---- | :---- |
| Who | need to see and practise the experiments in their physics textbooks but have limited access to a real laboratory. |
| The (product name) | PhysiX is a web-based 3D virtual physics laboratory |
| That | lets students run textbook experiments with the apparatus already set up and step-by-step instructions, or build their own setups in Open Lab; read virtual instruments; record and compare trials in tables and graphs; and ask an AI lab assistant to explain what is happening. |
| Unlike | textbooks and videos, which only show an experiment, and general simulation websites, which are not organized by the Vietnamese curriculum, |
| Our product | follows the GDPT 2018 textbooks lesson by lesson, lets students operate realistic 3D apparatus themselves, and keeps their results in their account so they can review and export them later. |

2. # **Teacher Product Position**

| For | Physics and Natural Science teachers in lower- and upper-secondary schools |
| :---- | :---- |
| Who | need to demonstrate experiments to the whole class when apparatus is missing, broken or takes too long to prepare. |
| The (product name) | PhysiX is a web-based 3D virtual physics laboratory |
| That | opens a textbook experiment with the apparatus already set up, so the teacher can run it on a projector, change one condition at a time and show live readings, data tables and graphs to the class. |
| Unlike | real demonstrations, which depend on working apparatus and preparation time, and recorded videos, which cannot be changed during the lesson, |
| Our product | uses the same lessons and apparatus names as the textbooks, and its results are checked against the textbook formulas and reviewed by a physics content expert. |

3. # **School Product Position**

| For | Lower- and upper-secondary schools in Vietnam |
| :---- | :---- |
| Who | want every class to gain practical physics experience without buying and maintaining apparatus for every experiment. |
| The (product name) | PhysiX is a web-based 3D virtual physics laboratory |
| That | runs in a standard web browser on the school’s existing computers, needs no installation, and covers the experiments of the GDPT 2018 physics curriculum. |
| Unlike | buying more physical apparatus, or international virtual-lab products that are not organized around the Vietnamese textbooks, |
| Our product | complements the school’s real laboratory: students prepare for and repeat experiments in PhysiX, while the school keeps its physical apparatus for the experiments that need it most. |

3. # **Stakeholder and User Descriptions**

This section describes the people and organizations with an interest in PhysiX, the users who work with it directly, the environment in which they use it and the alternatives available to them.

1. ## **Stakeholder Summary**

The following stakeholders have an interest in PhysiX but do not necessarily use it themselves. Students and teachers, the direct users, are described in Section 3.2.

| Name | Description | Responsibilities |
| :---- | :---- | :---- |
| Schools (customers) | Lower- and upper-secondary schools that adopt PhysiX for their students and teachers. | Decide whether to adopt PhysiX; provide computer rooms, projectors and internet access; inform students and parents about student accounts. |
| Physics department heads (customer representatives) | Heads of the Physics or Natural Science department at an adopting school. | Check that the experiments match what the school teaches; confirm and sign the usability acceptance checklist (Section 5); collect feedback from teachers. |
| Physics content expert | An experienced physics teacher engaged by Phy6 as a subject-matter adviser. | Reviews experiment procedures, formulas, units and parameter ranges before an experiment is released; reviews the rules that limit the AI lab assistant; investigates content error reports. |
| Parents and guardians | Parents or guardians of students who use PhysiX. | Expect a safe and useful tool for home study and expect their child’s personal data to be protected. |
| National curriculum (Ministry of Education and Training) | The General Education Programme 2018 and its approved textbooks. | Not directly involved; defines the lessons and experiments that the Experiment Library follows. |
| Phy6 | The company that develops and operates PhysiX. | Builds, tests and maintains PhysiX; keeps experiment content up to date; handles content error reports; provides user support. |

2. ## **User Summary**

PhysiX has two user groups: students, who are the primary users, and teachers, who are secondary users. Both groups use the same features; teachers do not have a separate interface. Anyone can browse the library, carry out experiments, use Open Lab and ask the AI lab assistant without an account. Signing in is needed to save results, view the experiment history and report content errors.

The typical tasks of each user group are summarized below.

* **Student – Guided Experiment:**  
  * **Task Profile:** Opens the Experiment Library, finds an experiment by grade, chapter or name and starts it. The apparatus is already on the bench and the steps are listed on the right. The student sets the conditions, runs the experiment, reads the instruments, records several trials, compares them in the table and graph, and presses Finish. A guided experiment typically takes 10-20 minutes.  
* **Student – Open Lab:**  
  * **Task Profile:** Opens Open Lab, takes apparatus from the drawer, places and connects it on an empty bench, runs the setup and reads the instruments. PhysiX tells the student when a combination of apparatus cannot be simulated yet.  
* **Physics Teacher – Classroom Demonstration:**  
  * **Task Profile:** Opens a guided experiment on the classroom computer connected to a projector, runs it in front of the class, changes one condition at a time and uses the live readings, table and graph to explain the result. The teacher may also try an experiment in advance to prepare a lesson.  
* **Signed-in User – Review and Export Results:**  
  * **Task Profile:** Opens the experiment history to review earlier results, exports a data table and graph for a lab report, or reports a suspected error in an experiment.

| Name | Description | Responsibilities | Stakeholder |
| :---- | :---- | :---- | :---- |
| Lower-secondary students (Grades 6-9) | Students aged about 11-15 who learn physics topics within the Natural Science subject. They can use a web browser but have little experience with laboratory instruments or 3D software. They are expected to use PhysiX one to three times a week, at home or in the school computer room, before or after the related lesson. They need short instructions, clearly labelled 3D apparatus and simple explanations. | Carry out guided experiments for their grade; record and compare trials; ask the AI lab assistant when stuck; explore apparatus in Open Lab. | Schools; parents and guardians |
| Upper-secondary students (Grades 10–12) | Students aged about 15-18 who study Physics as a subject. They are expected to use PhysiX one to three times a week, before or after the related lesson and when preparing practical reports or exams. In our interviews and survey, they wanted to operate 3D apparatus, change parameters, repeat trials and use virtual instruments, and 72% preferred an AI assistant that answers on request or prepares apparatus only after the user confirms. | Same as above, and also use graphs to find relationships between quantities (for example, between voltage and current) and export results for lab reports. | Schools; parents and guardians |
| Physics Teacher | Teachers of Physics (Grades 10-12) and Natural Science (Grades 6-9), usually teaching several classes of about 40 students. They use PhysiX on a classroom computer connected to a projector during lessons, and on their own computer when preparing lessons. In our interviews, teachers stressed that results must be scientifically accurate and that they want to check AI explanations before relying on them in class. | Demonstrate experiments to the class; explain readings, tables and graphs; check that results agree with the textbook; report content errors. | Schools (physics department heads) |

  3. ## **User Environment**

This section describes where, how and with what equipment PhysiX is used.

**Physical Environment**  
PhysiX is used in three settings: (1) at home, where a student works alone, usually in the evening; (2) in a school computer room, where one or two students share a computer during a 45-minute lesson; and (3) in a regular classroom, where the teacher runs an experiment on one computer connected to a projector for a class of about 40 students. A guided experiment is designed to be completed in 10-20 minutes so that it fits into part of a lesson.

Because lesson time is short and computers are shared, students must be able to restart an experiment quickly and, after signing in, find their saved results again on any computer.

**Devices and Technology**  
PhysiX runs in a web browser on desktop and laptop computers with Windows or macOS and requires no installation. Users need a mouse or touchpad and a keyboard to rotate the 3D view, drag apparatus and type exact values. The supported operating systems and browser versions are listed in Section 5\. Phones and tablets are not supported, because the 3D bench, the step list and the data panels need a larger screen.

**Users’ Technical Skills**  
Users are expected to know how to use a web browser, but not how to use 3D software or real laboratory instruments. PhysiX therefore labels every apparatus and control, always shows units, highlights the next step in guided experiments, and explains what went wrong when an action is not allowed.

**Typical Usage**  
A student opens PhysiX and sees the Experiment Library. They choose Grade 11 → Chapter IV → Lesson 23 “Resistance. Ohm’s law”, read the experiment introduction and press Start experiment. The circuit apparatus is already on the bench and the steps appear on the right. The student closes the switch, raises the voltage step by step, records each pair of voltage and current readings, and sees the points form a straight line on the I–U graph. When enough trials are recorded, the student presses Finish and, if signed in, the results are saved to their history. Later, the student opens Open Lab, takes apparatus from the drawer and tries a circuit of their own.

**Connectivity and Operating Constraints**  
PhysiX needs an internet connection to load the application and experiments, to sign in and save results, and to use the AI lab assistant. Once an experiment has loaded, the simulation runs on the user’s computer, so a slow connection does not slow down the experiment itself. If the AI lab assistant is unavailable, PhysiX shows a message and the experiment continues to work normally. If results cannot be saved because the connection is lost, PhysiX keeps them on screen and saves them when the connection returns.

**Other Applications**  
Students and teachers already use tools such as Zalo, Google Classroom, Microsoft Teams, Microsoft Office and Google Workspace to communicate and to hand in work. PhysiX does not connect to these tools directly. Instead, exported results use standard formats: the CSV data table opens in Microsoft Excel or Google Sheets, and the PNG graph can be inserted into a lab report in Word or Google Docs.

4. ## **Alternatives and Competition**

Students, teachers and schools currently have four main alternatives to PhysiX. Their strengths and weaknesses, as perceived by these users, are summarized below.  
**Real school laboratory**

* Strengths: real apparatus and real measurements; students develop hands-on skills and experience real measurement errors.  
* Weaknesses: requires apparatus, laboratory space, maintenance and preparation time; the number of kits limits how many students take part; experiments cannot be repeated at home.

**Textbooks and recorded videos**

* Strengths: free, follow the curriculum and are easy to share.  
* Weaknesses: students only read or watch; they cannot change conditions or take their own measurements.

**PhET Interactive Simulations (University of Colorado Boulder) \[1\]**

* Strengths: free, research-based simulations with sliders, measurement tools, multiple representations and immediate feedback.  
* Weaknesses: each simulation is a separate topic model rather than a laboratory with realistic apparatus; simulations are not organized by Vietnamese textbook lessons and do not follow a textbook laboratory procedure step by step.

**PraxiLabs \[2\]**

* Strengths: immersive 3D virtual laboratories with guided tutorials, hints, laboratory manuals and repeatable practice; plans for schools and universities.  
* Weaknesses: full access requires a paid subscription (individual plans start at US\$6.99 per month and school plans are quoted on request) \[3\]; its experiments are not organized by Vietnamese GDPT 2018 textbook lessons.

PhysiX combines what users value in these alternatives: the curriculum order of the textbooks, the realistic 3D apparatus and guided procedures of virtual laboratories, the freedom of a real laboratory through Open Lab, and an AI lab assistant that explains the current step. PhysiX does not replace real experiments; it lets every student prepare for and repeat them.  
**Sources:**  
 \[1\] University of Colorado Boulder, PhET Interactive Simulations, “About PhET.” Available at: [https\://phet.colorado.edu/en/about](https://phet.colorado.edu/en/about) (Accessed: 30 October 2026).  
 \[2\] PraxiLabs, “All Virtual Labs Features.” Available at: [https\://praxilabs.com/en/virtual-labs](https://praxilabs.com/en/virtual-labs) (Accessed: 30 October 2026).  
 \[3\] PraxiLabs, “Pricing.” Available at: [https\://praxilabs.com/en/pricing](https://praxilabs.com/en/pricing) (Accessed: 1 November 2026).

4. # **Product Features**

PhysiX provides nine features. Features 2 to 6 form the laboratory itself: users find an experiment, carry it out with guidance or freely in Open Lab, record and compare results, and ask the AI lab assistant for help. Features 1 and 7 to 9 let users keep, review and export their results and report content errors.

Each feature corresponds to one use case in the PhysiX Use-Case Specification (UC01–UC09). Parameters and accuracy requirements that belong to a specific experiment are stated in Feature 3\.

The following are outside the scope of PhysiX: class management, assigning or grading work, administrator accounts, and generating new experiments from free-text descriptions.

The following table summarizes the product features and their priorities.

| No. | Feature | Description | Priority |
| :---- | :---- | :---- | :---- |
| 1 | User Accounts | Users create an account with an email address and password, sign in and sign out. Guests can use the Experiment Library, Guided Experiments, Open Lab, the AI lab assistant and export the current results without an account. An account is needed to save results, view the experiment history and report content errors. PhysiX stores only the user’s name, email address and grade. (Use case: UC01 Sign up and sign in) | Medium |
| 2 | Experiment Library | Lists the experiments of the GDPT 2018 curriculum (Kết nối tri thức textbooks): Natural Science for Grades 6-9 and Physics for Grades 10-12, organized by Grade → Chapter → Lesson. Users can search by experiment name or keyword and filter by grade. Each experiment has an introduction page showing its learning objective, the textbook lesson it belongs to, the apparatus used and the expected duration. Experiments that do not yet have an interactive version are marked “Coming soon” and cannot be started. (Use case: UC02 Browse and open an experiment) | High |
| 3 | Guided Experiments | Opens the selected experiment with all apparatus already on the bench and shows its steps on the right side of the screen. The current step is highlighted; a step that must be done in order cannot be skipped, and PhysiX explains why. Users change conditions either by dragging the 3D apparatus or by typing an exact value; a value outside the allowed range is rejected and the allowed range is shown. Users can reset the current trial or restart the whole experiment. An experiment is complete when the user has recorded the minimum number of valid trials and presses Finish; PhysiX then shows a summary of the results. Each experiment defines its own parameters, ranges and accuracy, for example: **• Simple Pendulum (Grade 11, Chapter I “Oscillations”):** string length 0.20–1.50 m, release angle 1°–10°, bob mass 50–200 g, g \= 9.8 m/s². The simulation solves the full pendulum equation, assuming an inextensible massless string and no air resistance. The user measures the time of 10 oscillations with the stopwatch to obtain the period T. The simulated period agrees with T \= 2π√(l/g) within 1%. The experiment is complete after six trials in three pairs, each pair changing only the string length, the bob mass or the release angle, and after the result check described in UC03.1.4 is passed. . • **Ohm’s Law (Grade 11, Lesson 23 “Resistance. Ohm’s law”):** a circuit with an adjustable DC source (0–12 V), a fixed resistor (10 Ω, 20 Ω or 50 Ω), an ammeter in series, a voltmeter in parallel and a switch. The meters are ideal; voltage is displayed to 0.1 V and current to 1 mA, and the displayed current equals U/R within display rounding. The experiment is complete after at least 5 voltage–current pairs. (Use case: UC03 Perform a guided experiment; UC03.1 Simple Pendulum; UC03.2 Ohm’s Law) | High |
| 4 | Measurements and Results | Shows live readings on the virtual instruments of each experiment (for example, stopwatch, ruler, protractor, ammeter and voltmeter), always with units. The user records a trial with one click; each trial becomes a numbered row in the data table, with measured and calculated values in separately labelled columns. A graph with labelled axes and units is updated after each trial (for example, T against l for the pendulum and I against U for Ohm’s law). The user can select two or more trials and compare them in the table and on the graph. For signed-in users, recorded trials are saved to their account automatically. (Use case: UC04 Record and compare trial results) | High |
| 5 | AI Lab Assistant | An assistant panel available in Guided Experiments and Open Lab. It knows the current experiment, step and readings, and can explain the current step, an apparatus or a result and suggest how to fix a mistake. When it suggests changing a setting, the change is applied only after the user confirms it and only if the value is within the allowed range. The assistant does not create new experiments or invent measurements, and it tells the user when a question is outside the current experiment. If the AI service is unavailable, the experiment and its step instructions continue to work. (Use case: UC05 Ask the AI lab assistant) | High |
| 6 | Open Lab | A free laboratory that starts with an empty bench. The user opens the apparatus drawer, searches or browses the list of all apparatus, drags apparatus onto the bench, then moves, rotates, connects or removes it, runs the setup and reads the instruments. If a combination of apparatus cannot be simulated yet, PhysiX says so and keeps the bench as it was. The AI lab assistant is available. (Use case: UC06 Experiment freely in Open Lab) | Medium |
| 7 | Experiment History | Signed-in users see a list of the experiments they have carried out (experiment name, date and number of trials) and can open any entry to review its data table and graph. (Use case: UC07 View experiment history) | Low |
| 8 | Export Results | Users download the data table of an experiment as a CSV file and its graph as a PNG image, either from the result summary or from the experiment history. (Use case: UC08 Export experiment results) | Low |
| 9 | Report a Content Error | Signed-in users report a suspected error in an experiment, in Open Lab or in an AI answer (for example, a wrong formula, unit, reading, instruction or translation) with a short description. PhysiX attaches the experiment, step, settings and readings automatically. Phy6 and the physics content expert review every report within 7 working days and inform the user of the result by email. (Use case: UC09 Report a content error) | Low |

5. # **Non-Functional Requirements**

The following requirements apply to all features. Each requirement states a target and how it is verified, so that the school can accept or reject it based on evidence. Phy6 records the results in a test report that is handed to the school at acceptance. Accuracy requirements that belong to a specific experiment are stated in Feature 3\.

1. ## **Usability**

Usability is accepted with a checklist agreed with the customer. Phy6 provides the checklist below; the school’s physics department head confirms or adjusts it before acceptance testing. Phy6 then runs the agreed checklist on every guided experiment and on Open Lab, records Pass or Fail for each item with a screenshot as evidence, and the department head signs the result. Usability is accepted when every item passes.

* **NFR-U1:** The screen always shows the current mode (Guided Experiment or Open Lab) and the experiment name. Verification: the reviewer names the mode and the experiment without help. Evidence: a screenshot of each mode.  
* **NFR-U2:** Every measured or calculated value is shown with its unit. Verification: every value on the instruments, in the data table and on the graph axes has a unit. Evidence: a screenshot per experiment.  
* **NFR-U3:** Each trial in the data table is numbered, and measured values are separated from calculated values. Verification: a table with at least two trials shows trial numbers and labelled measured and calculated columns. Evidence: a screenshot.  
* **NFR-U4:** Users can run the experiment, reset the current trial, record a trial, view the graph, compare trials, ask the AI lab assistant and finish the experiment without leaving the experiment screen. Verification: all seven actions are completed from the experiment screen without page navigation. Evidence: a screen recording.  
* **NFR-U5:** The step list shows which steps are completed, which step is current and which steps remain. Verification: during a guided experiment, the three states are visually distinct. Evidence: a screenshot.  
* **NFR-U6:** An action that is not allowed shows a message next to the control that states the problem and how to fix it. Verification: enter one out-of-range value and attempt one step out of order; both show such a message. Evidence: a screenshot of each message.  
* **NFR-U7:** The user interface, step instructions, introduction pages, help and AI lab assistant answers are available in Vietnamese and English. Vietnamese is the default, and the user can switch language at any time without losing the current experiment. Verification: the reviewer switches language during a guided experiment and checks that every label, instruction and message changes language and that recorded trials remain. Evidence: a screenshot of the same screen in both languages.

  2. ## **Browser and Platform Compatibility**

PhysiX runs in a web browser on desktop and laptop computers with hardware-accelerated WebGL 2.0 graphics and needs no installation. The supported environments are:

* Windows 10 (version 22H2, 64-bit) or Windows 11: Google Chrome 120 or later, Microsoft Edge 120 or later, Mozilla Firefox 128 or later.  
* macOS 14 Sonoma or later: Apple Safari 17 or later, Google Chrome 120 or later.

Phones and tablets are not supported.  
Verification: for each supported operating system and browser, Phy6 opens the Experiment Library, completes one guided experiment, records two trials, views the graph and the trial comparison, and opens Open Lab. The evidence for each environment is a screenshot of the running experiment together with the browser version page and the operating system version. In a browser without WebGL 2.0, PhysiX shows a message naming the missing capability instead of a blank screen; this is verified by turning off hardware acceleration in one browser and capturing the message.

3. ## **Performance**

Performance targets are set per feature group, because some operations, such as loading 3D apparatus or waiting for the AI service, naturally take longer than others. The targets apply on a reference computer typical of school computer rooms (Intel Core i3 8th generation or equivalent, 8 GB RAM, integrated graphics) with a 20 Mbps internet connection.

* **User Accounts:** the sign-in or sign-up result is shown within 3 s.  
* **Experiment Library:** search or filter results are shown within 1 s.  
* **Guided Experiments and Open Lab (loading):** an experiment is ready to use within 5 s when its apparatus has been loaded before, and within 20 s on first use on a computer.  
* **Guided Experiments and Open Lab (controls):** run, reset, record, a slider change, a typed value or dragging apparatus gives a visible response within 200 ms.  
* **Measurements and Results:** live readings and the graph refresh at least 10 times per second during a running trial; the trial comparison opens within 1 s.  
* **Open Lab:** the message for an unsupported apparatus combination appears within 500 ms.  
* **AI Lab Assistant:** a loading indicator appears within 200 ms of a question; an answer, or a timeout message with a retry option, appears within 15 s. Experiment controls remain usable while waiting.  
* **Experiment History:** the list of experiments is shown within 2 s.  
* **Export Results:** the CSV and PNG files are ready within 3 s for up to 50 trials.  
* **Report a Content Error:** confirmation is shown within 3 s.

**Verification:** each operation is measured with the browser’s developer tools or timing built into PhysiX on the reference computer. The reported value is the median of 10 runs and is compared with the target in the performance test report.

4. ## **Reliability and Robustness**

PhysiX rejects non-numeric, out-of-range or otherwise invalid values before applying them, keeps the last valid value and shows the allowed range; the range of each parameter is stated in Feature 3\. Reset Trial stops the current trial and clears its unrecorded readings but keeps all recorded trials; Restart Experiment asks for confirmation before clearing all trials. If an experiment fails to load or a calculation fails, PhysiX shows a clear error and lets the user retry or restart without reloading the whole page. If the AI service is unavailable, all other features keep working. If saving fails because the connection is lost, recorded trials stay on screen and are saved when the connection returns; no recorded trial of a signed-in user is lost.

**Verification:** automated tests enter boundary, out-of-range and non-numeric values for every parameter of every experiment; manual tests cover Reset Trial, Restart Experiment, a failed experiment load, a disconnected AI service and a lost connection while saving. Evidence is the test log and screenshots of each error and recovery message.

5. ## **Security and Privacy**

PhysiX stores passwords only in hashed form and sends all data over HTTPS. It collects only the user’s name, email address and grade, and does not share personal data with third parties; the questions and experiment context sent to the AI service contain no personal data. Saved results are kept until the user deletes them or deletes their account; a user can delete their account and all saved results from their profile at any time. Personal data is handled in accordance with applicable Vietnamese personal data protection law.

**Verification:** a database inspection confirms that no password is stored in plain text; a browser check confirms that every page and request uses HTTPS; a test request to the AI service is inspected to confirm it contains no personal data; a test account is deleted and the database is checked to confirm that its data has been removed.

6. ## **Maintainability**

Each experiment is built as a separate module containing its own formulas, parameter ranges, units and reference tests, so that a new experiment can be added without changing existing ones. Every change to a formula or parameter range is reviewed by a second engineer and approved by the physics content expert before release.

**Verification:** the physics reference tests of every experiment run without the user interface; the release notes list each formula or range change together with its reviewer and approver.

7. ## **Physics Consistency (all experiments)**

All calculations use SI units, and every unit conversion is explicit. Rounding a value for display does not change the stored value. Repeating an experiment with the same settings gives the same results. Any simplifying assumption of an experiment (for example, ideal meters or no air resistance) is stated in the experiment’s introduction page. Each experiment is reviewed by the physics content expert before it is released.

**Verification:** the reference tests of each experiment are run twice with identical inputs and must give identical outputs; a test compares stored values with displayed values after rounding; the expert’s review record is kept for every released experiment.