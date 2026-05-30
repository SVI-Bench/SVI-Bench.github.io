// ── Plain JS globals (shared with the Babel block) ──────────────────
const { useEffect, useRef, useState } = React;

const PILLARS = {
  Perception: { base: '#4A7FB5', glow: 'rgba(74,127,181,0.55)', soft: 'rgba(74,127,181,0.12)' },
  Reasoning:  { base: '#2E9E8F', glow: 'rgba(46,158,143,0.55)', soft: 'rgba(46,158,143,0.12)' },
  Simulation: { base: '#D4913A', glow: 'rgba(212,145,58,0.55)', soft: 'rgba(212,145,58,0.12)' },
  Agency:     { base: '#C0392B', glow: 'rgba(192,57,43,0.55)',  soft: 'rgba(192,57,43,0.12)' },
};

const T3_PANEL = {"panels": [{"id": "basketball", "sport": "basketball", "query_simple": "Find the clip where a guard misses a contested two-point jumper after a catch-and-drive at the low post.", "query_full": "The basketball player performs 2 pt missed with a shot from low post with a jumper during catch and drive with a shot using right hand with a shot while contested.", "composition": {"action_name": "2-", "playtype": "Catch and Drive", "hand": "Right", "shot_type": "Jumper", "contesting": "Contested", "cur_pos": "Low Post"}, "thumbs": [{"id": "neg1", "is_gt": false, "sim": 0.84, "video": "assets/t3_videos/basketball/neg1.mp4", "caption": "On a post-up at the low post, a guard misses a contested two-point jumper.", "diff_substring": "post-up", "diff_axis": "playtype", "diff_values": {"positive": "Catch and Drive", "negative": "Post"}}, {"id": "neg2", "is_gt": false, "sim": 0.79, "video": "assets/t3_videos/basketball/neg2.mp4", "caption": "On a catch and drive from the low post, the guard puts up an uncontested jumper and misses the two point shot.", "diff_substring": "uncontested", "diff_axis": "contesting", "diff_values": {"positive": "Contested", "negative": "Uncontested"}}, {"id": "neg3", "is_gt": false, "sim": 0.74, "video": "assets/t3_videos/basketball/neg3.mp4", "caption": "A guard catches and drives from the low post, then makes a contested two-point jumper.", "diff_substring": "makes", "diff_axis": "action_name", "diff_values": {"positive": "2-", "negative": "2+"}}, {"id": "gt", "is_gt": true, "sim": 0.62, "video": "assets/t3_videos/basketball/gt.mp4", "caption": "After a catch-and-drive at the low post, a guard misses a contested two-point jumper.", "diff_substring": null, "diff_axis": null}]}, {"id": "soccer", "sport": "soccer", "query_simple": "Find the clip of a defender making a lateral pass down the right wing.", "query_full": "A soccer player in defender position performs pass successful with lateral pass attacking from the right side.", "composition": {"position": "defender", "primary_action": "pass+", "secondary_action": "lateral_pass", "flank": "right"}, "thumbs": [{"id": "neg1", "is_gt": false, "sim": 0.83, "video": "assets/t3_videos/soccer/neg1.mp4", "caption": "A defender plays a lateral pass through the center.", "diff_substring": "through the center", "diff_axis": "flank", "diff_values": {"positive": "right", "negative": "center"}}, {"id": "neg2", "is_gt": false, "sim": 0.78, "video": "assets/t3_videos/soccer/neg2.mp4", "caption": "A midfielder plays a lateral pass down the right flank.", "diff_substring": "midfielder", "diff_axis": "position", "diff_values": {"positive": "defender", "negative": "midfield"}}, {"id": "neg3", "is_gt": false, "sim": 0.73, "video": "assets/t3_videos/soccer/neg3.mp4", "caption": "A defender's lateral pass down the right flank is intercepted.", "diff_substring": "is intercepted", "diff_axis": "primary_action", "diff_values": {"positive": "pass+", "negative": "pass-"}}, {"id": "gt", "is_gt": true, "sim": 0.63, "video": "assets/t3_videos/soccer/gt.mp4", "caption": "A defender plays a lateral pass down the right flank.", "diff_substring": null, "diff_axis": null}]}, {"id": "hockey", "sport": "hockey", "query_simple": "Find the clip where a defender blocks a wrist shot in the offensive zone with the goalie in butterfly.", "query_full": "The hockey player performs blocked shot in the offensive zone with a wrist shot with a goalie having clean view shot view with a goalie having in the butterfly position stance.", "composition": {"action_name": "Blocked shot", "shot_type": "Wrist shot", "goalie_view": "Clean view shot", "goalie_stance": "In the butterfly position", "zone_name": "OZ"}, "thumbs": [{"id": "neg1", "is_gt": false, "sim": 0.82, "video": "assets/t3_videos/hockey/neg1.mp4", "caption": "In the offensive zone, a defender blocks a slapshot with the goalie in the butterfly position.", "diff_substring": "slapshot", "diff_axis": "shot_type", "diff_values": {"positive": "Wrist shot", "negative": "Slapshot"}}, {"id": "neg2", "is_gt": false, "sim": 0.77, "video": "assets/t3_videos/hockey/neg2.mp4", "caption": "A skater scores a goal in the offensive zone on a wrist shot while the goalie sits in butterfly.", "diff_substring": "scores a goal", "diff_axis": "action_name", "diff_values": {"positive": "Blocked shot", "negative": "Goal"}}, {"id": "neg3", "is_gt": false, "sim": 0.73, "video": "assets/t3_videos/hockey/neg3.mp4", "caption": "A defender blocks a wrist shot in the offensive zone while the goalie holds a split position.", "diff_substring": "split position", "diff_axis": "goalie_stance", "diff_values": {"positive": "In the butterfly position", "negative": "Split position"}}, {"id": "gt", "is_gt": true, "sim": 0.6, "video": "assets/t3_videos/hockey/gt.mp4", "caption": "A defender blocks a wrist shot in the offensive zone where the goalie is set in the butterfly.", "diff_substring": null, "diff_axis": null}]}]};
const T9_PANEL_CLIFF = {"question_id": 45,"question": "In New Orleans' wire-to-wire win with 14 first-half threes, how many more points were the Clippers down after Batum's Q3 four-point play than after Westbrook's Q2 three-point play?","category": "Two-Moment Score Math (3-point play vs 4-point play)","game_id": "1006435","gt_answer": "5","verdict": "Wrong","model": "GPT-5.2","mode": "oracle","num_turns": 8,"tool_counts": {"search_documents": 2,"document_qa": 2,"search_videos": 1,"video_qa_oracle": 3},"tool_summaries": [{"abbrev": "SD","key": "search_documents","text": "Searched game reports. Found the Pelicans vs Clippers game on the second try."},{"abbrev": "DQ","key": "document_qa","text": "Asked the report for score deficits. The report described the plays but didn't quote exact scores."},{"abbrev": "SV","key": "search_videos","text": "Switched to video. Found clips of both Westbrook's and Batum's plays."},{"abbrev": "VQ","key": "video_qa_oracle","text": "Asked 3 clips for the score. Got Westbrook's deficit (Clippers 48, Pelicans 56)","fail": "but the model forgets to ask Batum's clip the same question."},{"abbrev": "A","key": null,"text": "Refused to answer. Had one side of the comparison but not the other."}],"phases": [{"start_turn": 1,"end_turn": 4,"label": "Find the game"},{"start_turn": 5,"end_turn": 5,"label": "Browse videos"},{"start_turn": 6,"end_turn": 8,"label": "Miss half the evidence"},{"start_turn": 9,"end_turn": 9,"label": "Give up"}],"turns": [{"turn": 1,"tool": "search_documents","abbrev": "SD","thought": "Find the game \u2014 New Orleans wire-to-wire, 14 threes by halftime.","arguments": {"query": "New Orleans led wire-to-wire 14 threes by halftime Westbrook three-point play Batum four-point play","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "176266_report","teams": ["Charlotte Hornets","Brooklyn Nets"],"highlight": "Allen led the Nets with 11 points in the third.. \nThe Nets took a 56-51 lead into the locker room at the half as Prince andDeAndre Jordanled all score...","is_target": false},{"rank": 2,"doc_id": "867981_report","teams": ["Indiana Pacers","Cleveland Cavaliers"],"highlight": "\u201cWe can rely on him when it comes down to the wire or on a bucket or an assist.\u201d. \n","is_target": false},{"rank": 3,"doc_id": "406781_report","teams": ["Oklahoma City Thunder","Denver Nuggets"],"highlight": "Denver led 56-52 at halftime behind 13 points from Murray and 12 points and 12 rebounds by Jokic.. \nOklahoma City'sJerami Granthit a 3-pointer to tie ...","is_target": false}]}},{"turn": 2,"tool": "search_documents","abbrev": "SD","thought": "First search missed it. Try again with both team names.","arguments": {"query": "Clippers Pelicans led wire-to-wire 14 threes by halftime Westbrook three-point play Batum four-point play","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 1,"target_ranks": [1],"top": [{"rank": 1,"doc_id": "1006435_report","teams": ["New Orleans Pelicans","Los Angeles Clippers"],"highlight": "Clippers: FNicolas Batumprovided some offensive pop off the bench, finishing with 13 points, including a four-point play in the third quarter. \n... Mc...","is_target": true},{"rank": 2,"doc_id": "780877_report","teams": ["New Orleans Pelicans","Detroit Pistons"],"highlight": "The Pelicans' lead ballooned to 18 points later in the period when Alexander-Walker made a 3 and layup in succession.. \nTIP-INS. \n","is_target": false},{"rank": 3,"doc_id": "867981_report","teams": ["Indiana Pacers","Cleveland Cavaliers"],"highlight": "\u201cWe can rely on him when it comes down to the wire or on a bucket or an assist.\u201d. \n","is_target": false}]}},{"turn": 3,"tool": "document_qa","abbrev": "DQ","thought": "Got the game report. Ask it for both deficits in one go.","arguments": {"doc_ids": ["1006435_report"],"query": "In this report, by how many points were the Clippers trailing immediately after Russell Westbrook completed his three-point play in the second quarter, and by how many points were they trailing immediately after Nicolas Batum completed his four-point play in the third quarter? Provide the two deficits."},"results": {"kind": "docqa","results": [{"doc_id": "1006435_report","answer": "The report describes the plays but doesn't quote the exact score at each moment. It mentions Westbrook's three-point play and Batum's four-point play but not the deficit after each\u2026","is_target": false,"contains_answer": false}]}},{"turn": 4,"tool": "document_qa","abbrev": "DQ","thought": "Report doesn't quote the scores. Ask it again, even more directly.","arguments": {"doc_ids": ["1006435_report"],"query": "Quote the lines that mention: (1) Russell Westbrook completing a three-point play in the second quarter and state the score or how many points the Clippers trailed immediately after it; (2) Nicolas Batum completing a four-point play in the third quarter and state the score or how many points the Clippers trailed immediately after it. Provide the two deficits as numbers."},"results": {"kind": "docqa","results": [{"doc_id": "1006435_report","answer": "The report mentions both plays but does not state the score immediately after either one. It refers to Batum's 13 points including a four-point play in Q3, and Westbrook's contributions, but no deficit numbers\u2026","is_target": true,"contains_answer": false}]}},{"turn": 5,"tool": "search_videos","abbrev": "SV","thought": "Reports are a dead end. Search clips around Westbrook and Batum.","arguments": {"query": "three-point play and-one four-point play","game_ids": ["1006435"],"players": ["Russell Westbrook","Nicolas Batum"]},"results": {"kind": "videos","total": 74,"target_count": 4,"target_ranks": [5,39,68,74],"top": [{"rank": 1,"clip_id": "1006435_60","quarter": 2,"is_target": false,"frame": "assets/t9_frames/clip_1006435_60.jpg","clip": "assets/t9_clips/clip_1006435_60.mp4"},{"rank": 2,"clip_id": "1006435_78","quarter": 2,"is_target": false,"frame": "assets/t9_frames/clip_1006435_78.jpg","clip": "assets/t9_clips/clip_1006435_78.mp4"},{"rank": 3,"clip_id": "1006435_5","quarter": 1,"is_target": false,"frame": "assets/t9_frames/clip_1006435_5.jpg","clip": "assets/t9_clips/clip_1006435_5.mp4"}]}},{"turn": 6,"tool": "video_qa_oracle","abbrev": "VQ","thought": "Ask four clips what happened. Clip 188 (target) shows Batum's 3+1 \u2014 but only the action, not the score.","arguments": {"video_ids": ["1006435_177","1006435_178","1006435_188","1006435_189"],"query": "What is the sequence of actions that takes place in this video clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1006435_177","answer": "Josh Richardson misses a 3-point jumper from the corner (catch and shoot, right hand, contested by Nicolas Batum). Larry Nance Jr. secures the rebound. Larry Nance Jr. then misses a 2-point layup in the restricted are\u2026","is_target": false,"has_answer": true,"clip": "assets/t9_clips/clip_1006435_177.mp4","frame": "assets/t9_frames/clip_1006435_177.jpg"},{"clip_id": "1006435_178","answer": "Nicolas Batum attempts a 3-point jumper from the corner during a catch and shoot, but misses\u2026","is_target": false,"has_answer": false,"clip": "assets/t9_clips/clip_1006435_178.mp4","frame": "assets/t9_frames/clip_1006435_178.jpg"},{"clip_id": "1006435_188","answer": "Trey Murphy III commits a turnover. Nicolas Batum makes a 3-pointer from the wing and draws the foul for a four-point play\u2026","is_target": true,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_188.jpg","clip": "assets/t9_clips/clip_1006435_188.mp4"},{"clip_id": "1006435_189","answer": "Nicolas Batum made a free throw, resulting in the score update to Los Angeles Clippers 85 - 97 New Orleans Pelicans.","is_target": true,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_189.jpg"}]}},{"turn": 7,"tool": "video_qa_oracle","abbrev": "VQ","thought": "Probe eleven more clips for Westbrook's play sequence. Still asking 'what happened?', not 'what's the score?'","arguments": {"video_ids": ["1006435_78","1006435_87","1006435_92","1006435_93","1006435_98","1006435_101","1006435_106","1006435_110","1006435_112","1006435_116","1006435_118"],"query": "What is the sequence of actions that takes place in this video clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1006435_78","answer": "Russell Westbrook passes the ball to Eric Gordon. Eric Gordon catches the ball and immediately shoots a three-point jumper with his right hand from the point guard position, while being contested by CJ McCollum; the s\u2026","is_target": false,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_78.jpg","clip": "assets/t9_clips/clip_1006435_78.mp4"},{"clip_id": "1006435_87","answer": "Russell Westbrook attempts a 3-point jumper from the corner during a catch and shoot, shoots with his right hand while uncontested, misses the shot, and Naji Marshall secures the rebound.","is_target": false,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_87.jpg","clip": "assets/t9_clips/clip_1006435_87.mp4"},{"clip_id": "1006435_92","answer": "CJ McCollum attempts a 3-point jump shot using a step-back during a catch and drive with his right hand, contested by Nicolas Batum, resulting in a miss. Russell Westbrook then secures the rebound.","is_target": false,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_92.jpg","clip": "assets/t9_clips/clip_1006435_92.mp4"},{"clip_id": "1006435_93","answer": "Russell Westbrook attempts a 2-point jumper from the restricted area using a spin move during a pick-and-roll play with his right hand, while being contested by CJ McCollum. His shot misses, and CJ McCollum then secur\u2026","is_target": false,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_93.jpg"},{"clip_id": "1006435_98","answer": "Kawhi Leonard assists Russell Westbrook. Brandon Ingram commits a foul. Westbrook scores an and-one layup from the restricted area during a pick-and-roll\u2026","is_target": true,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_98.jpg","clip": "assets/t9_clips/clip_1006435_98.mp4"},{"clip_id": "1006435_101","answer": "The sequence of actions in this video clip consists of Russell Westbrook committing a turnover.","is_target": false,"has_answer": true},{"clip_id": "1006435_106","answer": "Russell Westbrook receives an assist from Nicolas Batum. Naji Marshall commits a turnover\u2026","is_target": false,"has_answer": true},{"clip_id": "1006435_110","answer": "1. Naji Marshall misses a 3-point shot from the corner with a right-handed jumper during an uncontested catch-and-shoot (guarded by Marcus Morris). 2. Russell Westbrook rebounds the ball. 3. Naji Marshall commits a foul.","is_target": false,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_110.jpg"},{"clip_id": "1006435_112","answer": "Naji Marshall committed a technical foul first, followed by Russell Westbrook making a free throw for the Los Angeles Clippers. The technical foul resulted in the Clippers gaining possession of the ball and Westbrook\u2026","is_target": false,"has_answer": true},{"clip_id": "1006435_116","answer": "The sequence of actions in this video clip begins with Kawhi Leonard executing a catch and shoot 3-point jumper from the wing using his right hand while being contested by Brandon Ingram. The shot is missed, and immed\u2026","is_target": false,"has_answer": true},{"clip_id": "1006435_118","answer": "Russell Westbrook attempts a 3-point jumper from the corner during a catch-and-shoot play with his right hand while being contested by CJ McCollum, resulting in a missed shot. Larry Nance Jr. secures the rebound.","is_target": false,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_118.jpg"}]}},{"turn": 8,"tool": "video_qa_oracle","abbrev": "VQ","thought": "Finally ask one target clip for the score after Westbrook's play. Get back 'Clippers 48 \u2013 56 Pelicans.'","arguments": {"video_ids": ["1006435_98"],"query": "What is the current score of the game?"},"results": {"kind": "videoqa","results": [{"clip_id": "1006435_98","answer": "Los Angeles Clippers 48 - 56 New Orleans Pelicans","is_target": true,"has_answer": true,"frame": "assets/t9_frames/clip_1006435_98.jpg","clip": "assets/t9_clips/clip_1006435_98.mp4"}]}}],"final_answer": "I cannot find the answer in the provided documents or videos.","final_thought": "Have Westbrook's deficit (Clippers down 8). For Batum's play, only the action description \u2014 no score state. Refuse without both."};
const T9_PANEL_ASK = {"question_id": 42,"question": "In the game where Devin Booker hit six threes and Phoenix finished with 20 made threes, find the early third-quarter shot that trimmed Chicago's lead from four down to one. What jersey number was the scorer wearing?","model": "GPT-5.2","mode": "non-oracle","gt_answer": "35","verdict": "Wrong","num_turns": 17,"tool_counts": {"search_documents": 3,"document_qa": 2,"search_videos": 3,"video_qa": 9},"phases": [{"start_turn": 1,"end_turn": 3,"label": "Wrong game"},{"start_turn": 4,"end_turn": 5,"label": "Find the game"},{"start_turn": 6,"end_turn": 8,"label": "Find the clip by score"},{"start_turn": 9,"end_turn": 14,"label": "Can't read the jersey"},{"start_turn": 15,"end_turn": 17,"label": "Try other clips, read the jersey"},{"start_turn": 18,"end_turn": 18,"label": "Guess #5"}],"turns": [{"turn": 1,"tool": "search_documents","abbrev": "SD","thought": "Find the Suns\u2013Bulls game where Booker had six threes and Phoenix made twenty.","arguments": {"query": "Booker six 3-pointers Phoenix 20 threes Chicago","doc_type": "espn_report","teams": ["Phoenix Suns","Chicago Bulls"]},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "999442_espn_report","teams": ["Phoenix Suns","Chicago Bulls"],"highlight": "Booker scored a season-high 51 points in just three quarters, Deandre Ayton had 30 points and 14 rebounds and Phoenix stretched its winning streak to si\u2026","is_target": false},{"rank": 2,"doc_id": "868755_espn_report","teams": ["Phoenix Suns","Chicago Bulls"],"highlight": "7 in Chicago, with Booker scoring 38 points in a 127-124 Suns victory.\u2026","is_target": false},{"rank": 3,"doc_id": "176598_espn_report","teams": ["Phoenix Suns","Memphis Grizzlies"],"highlight": "Booker shot 13 of 20 from the field and 13 of 14 on free throws.\u2026","is_target": false}]}},{"turn": 2,"tool": "document_qa","abbrev": "DQ","thought": "Check if either report matches both conditions.","arguments": {"doc_ids": ["999442_espn_report","868755_espn_report"],"query": "Does this report state that Devin Booker made six 3-pointers and that the Phoenix Suns finished with 20 made 3-pointers in this game?"},"results": {"kind": "docqa","results": [{"doc_id": "999442_espn_report","answer": "Booker made six threes (6 of 7 from 3-point range), but the team total was not 20.","is_target": false,"contains_answer": false},{"doc_id": "868755_espn_report","answer": "No match for six threes or team total of 20.","is_target": false,"contains_answer": false}]}},{"turn": 3,"tool": "search_documents","abbrev": "SD","thought": "Stats matched multiple games. Search for the specific play instead.","arguments": {"query": "Durant third quarter trimmed lead four to one Chicago","doc_type": "espn_report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "732051_espn_report","teams": ["Phoenix Suns","Cleveland Cavaliers"],"highlight": "Durant scored 12 of his 23 points in the third quarter as Phoenix pulled away.\u2026","is_target": false},{"rank": 2,"doc_id": "868755_espn_report","teams": ["Phoenix Suns","Chicago Bulls"],"highlight": "Durant had 15 points and seven rebounds in a 127-124 Suns victory.\u2026","is_target": false},{"rank": 3,"doc_id": "1003345_espn_report","teams": ["Phoenix Suns","New Orleans Pelicans"],"highlight": "Durant scored 28 and Phoenix outscored New Orleans 34-19 in the third.\u2026","is_target": false}]}},{"turn": 4,"tool": "search_documents","abbrev": "SD","thought": "Try both player names and 'career high' to match report language.","arguments": {"query": "Devin Booker career high six 3s Durant 20 points Chicago Bulls","doc_type": "espn_report"},"results": {"kind": "documents","total": 20,"target_count": 1,"target_ranks": [2],"top": [{"rank": 1,"doc_id": "1033329_espn_report","teams": ["Phoenix Suns","Denver Nuggets"],"highlight": "Booker had another ultra-efficient scoring night, shooting 20 of 25 from the field, including 5 of 8 from 3-point range.\u2026","is_target": false},{"rank": 2,"doc_id": "1003418_espn_report","teams": ["Phoenix Suns","Chicago Bulls"],"highlight": "And they're off to a good start with their shiny new star..\nDevin Booker scored 35 points and matched his career high with six 3s, Durant added 20 points in his second game with P\u2026","is_target": true},{"rank": 3,"doc_id": "868063_espn_report","teams": ["Los Angeles Lakers","Cleveland Cavaliers"],"highlight": "Augustine added 20 points, making all six 3-pointers.\u2026","is_target": false}]}},{"turn": 5,"tool": "document_qa","abbrev": "DQ","thought": "Ask the report to confirm both stats and identify the scorer.","arguments": {"doc_ids": ["1003418_espn_report"],"query": "In this game report, what early third-quarter shot trimmed Chicago's lead from four points down to one, and who made the shot?"},"results": {"kind": "docqa","results": [{"doc_id": "1003418_espn_report","answer": "Kevin Durant scored seven straight points early in the third quarter to trim Chicago's lead from four points down to one, putting the Suns back on top 70-67.","is_target": true,"contains_answer": false}]}},{"turn": 6,"tool": "search_videos","abbrev": "SV","thought": "Switch to video. Search the early-Q3 window in the right game.","arguments": {"query": "Durant early third quarter shot cuts lead to one","game_ids": ["1003418"],"quarter": 3,"players": ["Kevin Durant"]},"results": {"kind": "videos","total": 60,"target_count": 1,"target_ranks": [12],"top": [{"rank": 1,"clip_id": "1003418_144","quarter": 3,"is_target": false,"frame": "assets/t9_frames/clip_1003418_144.jpg","clip": "assets/t9_clips/clip_1003418_144.mp4"},{"rank": 2,"clip_id": "1003418_142","quarter": 3,"is_target": false,"frame": "assets/t9_frames/clip_1003418_142.jpg","clip": "assets/t9_clips/clip_1003418_142.mp4"},{"rank": 3,"clip_id": "1003418_145","quarter": 3,"is_target": false,"frame": "assets/t9_frames/clip_1003418_145.jpg","clip": "assets/t9_clips/clip_1003418_145.mp4"}]}},{"turn": 7,"tool": "video_qa","abbrev": "VQ","thought": "Check the score to find which clip has the play that trimmed the lead.","arguments": {"video_ids": ["1003418_140"],"query": "What is the current score of the game?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_140","answer": "Chicago Bulls 67, Phoenix Suns 63.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_140.jpg","clip": "assets/t9_clips/clip_1003418_140.mp4"}]}},{"turn": 8,"tool": "video_qa","abbrev": "VQ","thought": "Check the next clip. Lead went from 4 to 1, this is the scoring play.","arguments": {"video_ids": ["1003418_141"],"query": "What is the current score of the game?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_141","answer": "Chicago Bulls 67, Phoenix Suns 66.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_141.jpg","clip": "assets/t9_clips/clip_1003418_141.mp4"}]}},{"turn": 9,"tool": "video_qa","abbrev": "VQ","thought": "Found the right clip. Ask for the scorer's jersey number.","arguments": {"video_ids": ["1003418_141"],"query": "What is the jersey number of the player who scores in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_141","answer": "The player scores but I cannot read the jersey number in this clip.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_141.jpg","clip": "assets/t9_clips/clip_1003418_141.mp4"}]}},{"turn": 10,"tool": "search_videos","abbrev": "SV","thought": "Jersey not visible in the scoring clip. Search for other clips with Kevin Durant.","arguments": {"query": "Kevin Durant early third quarter","game_ids": ["1003418"],"quarter": 3,"temporal_boundary": "0-120"},"results": {"kind": "videos","total": 75,"target_count": 1,"target_ranks": [8],"top": [{"rank": 1,"clip_id": "1003418_138","quarter": 3,"is_target": false,"frame": "assets/t9_frames/clip_1003418_138.jpg","clip": "assets/t9_clips/clip_1003418_138.mp4"},{"rank": 2,"clip_id": "1003418_139","quarter": 3,"is_target": false,"frame": "assets/t9_frames/clip_1003418_139.jpg","clip": "assets/t9_clips/clip_1003418_139.mp4"},{"rank": 3,"clip_id": "1003418_140","quarter": 3,"is_target": false,"frame": "assets/t9_frames/clip_1003418_140.jpg","clip": "assets/t9_clips/clip_1003418_140.mp4"}]}},{"turn": 11,"tool": "video_qa","abbrev": "VQ","thought": "Ask the scoring clip again, this time naming Durant directly.","arguments": {"video_ids": ["1003418_141"],"query": "What is the jersey number of Kevin Durant in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_141","answer": "Kevin Durant scores in this clip, but his jersey number is not readable.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_141.jpg","clip": "assets/t9_clips/clip_1003418_141.mp4"}]}},{"turn": 12,"tool": "video_qa","abbrev": "VQ","thought": "Try a different clip where Durant might be visible.","arguments": {"video_ids": ["1003418_167"],"query": "What is the jersey number of Kevin Durant in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_167","answer": "Kevin Durant grabs a rebound. Another player blocks the view of his jersey.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_167.jpg","clip": "assets/t9_clips/clip_1003418_167.mp4"}]}},{"turn": 13,"tool": "video_qa","abbrev": "VQ","thought": "Try another clip.","arguments": {"video_ids": ["1003418_160"],"query": "What is the jersey number of Kevin Durant in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_160","answer": "Kevin Durant is defending in this clip. His jersey number is unclear from this angle.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_160.jpg","clip": "assets/t9_clips/clip_1003418_160.mp4"}]}},{"turn": 14,"tool": "video_qa","abbrev": "VQ","thought": "Still can't read the jersey. One more clip.","arguments": {"video_ids": ["1003418_142"],"query": "What is the jersey number of Kevin Durant in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_142","answer": "I can see Kevin Durant on screen with several other players, but the jersey numbers overlap.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_142.jpg","clip": "assets/t9_clips/clip_1003418_142.mp4"}]}},{"turn": 15,"tool": "search_videos","abbrev": "SV","thought": "Last search for clips where Durant's jersey might be visible.","arguments": {"query": "","game_ids": ["1003418"],"players": ["Kevin Durant"]},"results": {"kind": "videos","total": 56,"target_count": 1,"target_ranks": [15],"top": [{"rank": 1,"clip_id": "1003418_2","quarter": 1,"is_target": false,"frame": "assets/t9_frames/clip_1003418_2.jpg","clip": "assets/t9_clips/clip_1003418_2.mp4"},{"rank": 2,"clip_id": "1003418_6","quarter": 1,"is_target": false,"frame": "assets/t9_frames/clip_1003418_6.jpg","clip": "assets/t9_clips/clip_1003418_6.mp4"},{"rank": 3,"clip_id": "1003418_40","quarter": 1,"is_target": false,"frame": "assets/t9_frames/clip_1003418_40.jpg","clip": "assets/t9_clips/clip_1003418_40.mp4"}]}},{"turn": 16,"tool": "video_qa","abbrev": "VQ","thought": "Ask one more clip.","arguments": {"video_ids": ["1003418_148"],"query": "What is the jersey number of Kevin Durant in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_148","answer": "Jevon Carter (#5) is in the play. Durant is in the background and his jersey is not readable.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_148.jpg","clip": "assets/t9_clips/clip_1003418_148.mp4"}]}},{"turn": 17,"tool": "video_qa","abbrev": "VQ","thought": "One last try before giving up.","arguments": {"video_ids": ["1003418_145"],"query": "What is the jersey number of Kevin Durant in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "1003418_145","answer": "Cameron Payne (#15) sets a screen. I cannot make out Durant's jersey number from this frame.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_1003418_145.jpg","clip": "assets/t9_clips/clip_1003418_145.mp4"}]}}],"final_answer": "5","final_thought": "Seventeen turns of searching. Spent three turns on the wrong game before finding the right one. Found the clip, but couldn't read the jersey number. Guessed #5. Wrong, GT was #35.","tool_summaries": [{"abbrev": "SD","key": "search_documents","text": "Searched three times for the game report. First two returned similar Suns games but not the right one. Third search found the Suns vs Bulls report at rank 2."},{"abbrev": "DQ","key": "document_qa","text": "First check confirmed the top hits were wrong games. Second confirmed Kevin Durant trimmed the lead from four to one early in Q3."},{"abbrev": "SV","key": "search_videos","text": "Searched for the scoring clip three times with different filters."},{"abbrev": "VQ","key": "video_qa","text": "Used scores to find the right clip (lead went from +4 to +1). Then asked 6 different clips for Durant's jersey number, none could read it."},{"abbrev": "A","key": null,"text": "Guessed #5.","fail": "The answer was #35 (Kevin Durant)."}]};
const T3_ARCHIVE = {"panels": [{"id": "bb_jersey", "sport": "basketball", "axis_label": "jersey number", "query": "Find the clip where #55 makes a free throw.", "thumbs": [{"video": "assets/t3_archive/bb_jersey/gt.mp4", "caption": "Player #55 makes a free throw.", "sim": 0.62, "is_gt": true}, {"video": "assets/t3_archive/bb_jersey/hn1.mp4", "caption": "Player #24 makes a successful free throw.", "sim": 0.84, "diff_substring": "#24", "is_gt": false}, {"video": "assets/t3_archive/bb_jersey/hn2.mp4", "caption": "#8 makes a free throw.", "sim": 0.79, "diff_substring": "#8", "is_gt": false}, {"video": "assets/t3_archive/bb_jersey/hn3.mp4", "caption": "Player #6 tries a free throw, and makes it.", "sim": 0.74, "diff_substring": "#6", "is_gt": false}]}, {"id": "bb_hand", "sport": "basketball", "axis_label": "shooting hand", "query": "Find the clip of a right-handed contested two-point jumper from the top.", "thumbs": [{"video": "assets/t3_archive/bb_hand/gt.mp4", "caption": "A right-handed contested jumper from the top.", "sim": 0.61, "is_gt": true}, {"video": "assets/t3_archive/bb_hand/hn1.mp4", "caption": "A contested jumper from the top with the left hand.", "sim": 0.83, "diff_substring": "left hand", "is_gt": false}, {"video": "assets/t3_archive/bb_hand/hn2.mp4", "caption": "A left-handed jumper from the top off a pick-and-roll.", "sim": 0.78, "diff_substring": "left-handed", "is_gt": false}, {"video": "assets/t3_archive/bb_hand/hn3.mp4", "caption": "A left-handed catch-and-shoot jumper while contested.", "sim": 0.73, "diff_substring": "left-handed", "is_gt": false}]}, {"id": "soc_player", "sport": "soccer", "axis_label": "player name", "query": "K. Stoup wins a duel attacking from the right side.", "thumbs": [{"video": "assets/t3_archive/soc_player/gt.mp4", "caption": "K. Stoup attacks from the right side and wins a duel.", "sim": 0.63, "is_gt": true}, {"video": "assets/t3_archive/soc_player/hn1.mp4", "caption": "A. Pope wins a duel on the right side.", "sim": 0.82, "diff_substring": "A. Pope", "is_gt": false}, {"video": "assets/t3_archive/soc_player/hn2.mp4", "caption": "N\u00e9lson Semedo attacks from the right and wins the duel.", "sim": 0.77, "diff_substring": "N\u00e9lson Semedo", "is_gt": false}, {"video": "assets/t3_archive/soc_player/hn3.mp4", "caption": "Mart\u00edn Zubimendi wins a duel, attacking from the right side.", "sim": 0.72, "diff_substring": "Mart\u00edn Zubimendi", "is_gt": false}]}, {"id": "hky_zone", "sport": "hockey", "axis_label": "shot type", "query": "A wrist shot in the offensive zone, with the goalie in the butterfly position.", "thumbs": [{"video": "assets/t3_archive/hky_zone/gt.mp4", "caption": "The player takes a wrist shot in the offensive zone with the goalie in the butterfly position.", "sim": 0.6, "is_gt": true}, {"video": "assets/t3_archive/hky_zone/hn1.mp4", "caption": "A backhand shot in the offensive zone, as the goalie is in the butterfly position.", "sim": 0.83, "diff_substring": "backhand", "is_gt": false}, {"video": "assets/t3_archive/hky_zone/hn2.mp4", "caption": "A deflection in the offensive zone with the goalie in the butterfly position.", "sim": 0.78, "diff_substring": "deflection", "is_gt": false}, {"video": "assets/t3_archive/hky_zone/hn3.mp4", "caption": "While the goalie is in the butterfly position, the player takes a slapshot from the offensive zone.", "sim": 0.73, "diff_substring": "slapshot", "is_gt": false}]}]};
const T9_ARCHIVE = {"cards": [{"id": "doc_only", "label": "Stuck in documents", "sport": "basketball", "tagline": "Only looks at reports. Never opens a single video clip, then gives up.", "summary": "Searches game reports 12 times, questions them 4 times. Never invokes a video tool.", "question_short": "What shot type was the first made basket of the Heat player who tripled his usual first-quarter points?", "question_id": 34, "question": "In the matchup where a Heat player scored more than triple his usual first-quarter points for the season, what shot type was his very first made basket of the night?", "gt_answer": "Alley oop", "final_answer": "I cannot find the answer in the provided documents or videos.", "num_turns": 16, "tool_counts": {"search_documents": 12, "document_qa": 4}, "tool_seq": [{"turn": 1, "tool": "search_documents", "abbrev": "SD"}, {"turn": 2, "tool": "search_documents", "abbrev": "SD"}, {"turn": 3, "tool": "search_documents", "abbrev": "SD"}, {"turn": 4, "tool": "search_documents", "abbrev": "SD"}, {"turn": 5, "tool": "search_documents", "abbrev": "SD"}, {"turn": 6, "tool": "search_documents", "abbrev": "SD"}, {"turn": 7, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 8, "tool": "search_documents", "abbrev": "SD"}, {"turn": 9, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 10, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 11, "tool": "search_documents", "abbrev": "SD"}, {"turn": 12, "tool": "search_documents", "abbrev": "SD"}, {"turn": 13, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 14, "tool": "search_documents", "abbrev": "SD"}, {"turn": 15, "tool": "search_documents", "abbrev": "SD"}, {"turn": 16, "tool": "search_documents", "abbrev": "SD"}]}, {"id": "perception_bn", "label": "Video perception bottleneck", "sport": "hockey", "tagline": "Watches the clips but can't pick out the right detail.", "summary": "Finds the game, then asks 10 clips. VQA gives noisy, inconsistent answers. Settles on '8', wrong.", "question_short": "From the opening faceoff to the Siegenthaler\u2013Schenn puck battle, how many takeaways happened in New Jersey's back-to-back road win?", "question_id": "perception_bn", "question": "In the game where New Jersey won back-to-back road games for the first time that season and also had an offside call on Yegor Sharangovich near the end of the first period, how many takeaways happened from the opening faceoff up to (and including) the puck battle between Jonas Siegenthaler and Brayden Schenn early in Period 1?", "gt_answer": "2", "final_answer": "8", "num_turns": 18, "tool_counts": {"search_documents": 2, "document_qa": 1, "search_videos": 5, "video_qa": 10}, "tool_seq": [{"turn": 1, "tool": "search_documents", "abbrev": "SD"}, {"turn": 2, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 3, "tool": "search_documents", "abbrev": "SD"}, {"turn": 4, "tool": "search_videos", "abbrev": "SV"}, {"turn": 5, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 6, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 7, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 8, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 9, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 10, "tool": "search_videos", "abbrev": "SV"}, {"turn": 11, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 12, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 13, "tool": "search_videos", "abbrev": "SV"}, {"turn": 14, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 15, "tool": "search_videos", "abbrev": "SV"}, {"turn": 16, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 17, "tool": "search_videos", "abbrev": "SV"}, {"turn": 18, "tool": "video_qa", "abbrev": "VQ"}]}, {"id": "aggregation_fail", "label": "Cross-clip aggregation failure", "sport": "soccer", "tagline": "Checks each clip one by one but never puts the answers together.", "summary": "23 turns and 21 video calls. The agent looks at one key pass at a time but never counts up the pass types across clips, returning a player name instead of a pass type.", "question_short": "In the Arsenal\u2013Everton match where Arsenal took over 20 shots and Everton just three, which pass type was most common among Arsenal's key passes?", "question_id": "aggregation_fail", "question": "In the match where Arsenal\u2019s first-half corner count was unusually high compared with Tottenham\u2019s, focus on the first-half moment when Tottenham\u2019s D. Spence committed a foul on R. Sterling after losing a defensive ground duel on the right side; who was the Arsenal player that had just won the interception and immediately passed to Sterling to start that chain?", "gt_answer": "cross", "final_answer": "B. White", "num_turns": 23, "tool_counts": {"search_videos": 7, "search_documents": 1, "document_qa": 1, "video_qa": 14}, "tool_seq": [{"turn": 1, "tool": "search_videos", "abbrev": "SV"}, {"turn": 2, "tool": "search_videos", "abbrev": "SV"}, {"turn": 3, "tool": "search_videos", "abbrev": "SV"}, {"turn": 4, "tool": "search_videos", "abbrev": "SV"}, {"turn": 5, "tool": "search_videos", "abbrev": "SV"}, {"turn": 6, "tool": "search_documents", "abbrev": "SD"}, {"turn": 7, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 8, "tool": "search_videos", "abbrev": "SV"}, {"turn": 9, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 10, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 11, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 12, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 13, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 14, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 15, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 16, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 17, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 18, "tool": "search_videos", "abbrev": "SV"}, {"turn": 19, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 20, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 21, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 22, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 23, "tool": "video_qa", "abbrev": "VQ"}]}]};
const T9_ARC_PANELS = {'doc_only': {"question_id": "doc_only","question": "In the matchup where a Heat player scored more than triple his usual first-quarter points for the season, what shot type was his very first made basket of the night?","model": "GPT-5.2","mode": "oracle","gt_answer": "Alley oop","verdict": "Wrong","num_turns": 16,"tool_counts": {"search_documents": 12,"document_qa": 4},"phases": [{"start_turn": 1,"end_turn": 6,"label": "Search for the game"},{"start_turn": 7,"end_turn": 13,"label": "Ask reports, no luck"},{"start_turn": 14,"end_turn": 16,"label": "Keep searching"},{"start_turn": 17,"end_turn": 17,"label": "Give up"}],"turns": [{"turn": 1,"tool": "search_documents","abbrev": "SD","thought": "Search reports for the Heat game with the first-quarter scoring spike.","arguments": {"query": "Heat more than triple his usual first-quarter points season first quarter","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "405021_report","teams": ["Miami Heat"],"highlight": "Heat: Had 13 turnovers in the first half, including nine in the second quarter -- the most they've had in any quarter this season.. \nHornets: Charlott...","is_target": false},{"rank": 2,"doc_id": "359740_report","teams": ["Los Angeles Lakers","Miami Heat"],"highlight": "... The Lakers had 10 turnovers in the first quarter, matching the NBA high for any team in any first quarter this season.. \nHeat: Butler had 19 point...","is_target": false},{"rank": 3,"doc_id": "204676_report","teams": ["Houston Rockets","Miami Heat"],"highlight": "It was a record-setting opening quarter for the Heat -- resulting in the third-biggest lead after 12 minutes in the NBA's shot-clock era, starting wit...","is_target": false}]}},{"turn": 2,"tool": "search_documents","abbrev": "SD","thought": "Plan: find the game report, check player stats, then find the shot in video.","arguments": {"query": "\"more than triple his usual first-quarter points\" Heat","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "176398_report","teams": ["Miami Heat","Chicago Bulls"],"highlight": "They improved to 10-0 at home this season, extending the best home start in franchise history.. \n\"I don't shy away from taking the big shot,\" Herro sa...","is_target": false},{"rank": 2,"doc_id": "867851_report","teams": ["Milwaukee Bucks","Cleveland Cavaliers"],"highlight": "Cavaliers: Garland entered the night having scored more than 30 points in each of his last two games, but he cooled off Monday and shot just 3 of 12. ...","is_target": false},{"rank": 3,"doc_id": "401111_report","teams": ["Miami Heat","Brooklyn Nets"],"highlight": "After three minutes of the second quarter, the Heat were shooting 25.7 percent -- which not only had them in the lead, it also outpaced the Nets' 22.2...","is_target": false}]}},{"turn": 3,"tool": "search_documents","abbrev": "SD","thought": "Try different search terms for the Heat first-quarter scoring spike.","arguments": {"query": "Heat more than triple his usual first-quarter points for the season usual first-quarter points season","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "405021_report","teams": ["Miami Heat"],"highlight": "Heat: Had 13 turnovers in the first half, including nine in the second quarter -- the most they've had in any quarter this season.. \nHornets: Charlott...","is_target": false},{"rank": 2,"doc_id": "359740_report","teams": ["Los Angeles Lakers","Miami Heat"],"highlight": "... The Lakers had 10 turnovers in the first quarter, matching the NBA high for any team in any first quarter this season.. \nHeat: Butler had 19 point...","is_target": false},{"rank": 3,"doc_id": "985017_report","teams": ["Charlotte Hornets","Miami Heat"],"highlight": "It was only the second time this season that Miami won a game by more than seven points, and ended a streak of six consecutive single-digit games for ...","is_target": false}]}},{"turn": 4,"tool": "search_documents","abbrev": "SD","thought": "Try different query phrasing to find the right report.","arguments": {"query": "\"usual first-quarter points\" Heat season","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "405021_report","teams": ["Miami Heat"],"highlight": "Heat: Had 13 turnovers in the first half, including nine in the second quarter -- the most they've had in any quarter this season.. \nHornets: Charlott...","is_target": false},{"rank": 2,"doc_id": "359740_report","teams": ["Los Angeles Lakers","Miami Heat"],"highlight": "... The Lakers had 10 turnovers in the first quarter, matching the NBA high for any team in any first quarter this season.. \nHeat: Butler had 19 point...","is_target": false},{"rank": 3,"doc_id": "204676_report","teams": ["Houston Rockets","Miami Heat"],"highlight": "It was a record-setting opening quarter for the Heat -- resulting in the third-biggest lead after 12 minutes in the NBA's shot-clock era, starting wit...","is_target": false}]}},{"turn": 5,"tool": "search_documents","abbrev": "SD","thought": "Still searching. None of the reports match both criteria.","arguments": {"query": "more than triple his usual first-quarter points for the season Heat","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "1006446_report","teams": ["Memphis Grizzlies","Miami Heat"],"highlight": "MIAMI -- \u2014 For the first time in nearly two months, theMiami Heatgot an easy one.. \nBam Adebayoscored 26 points,Tyler Herroadded 24 and the Heat shot ...","is_target": false},{"rank": 2,"doc_id": "985017_report","teams": ["Charlotte Hornets","Miami Heat"],"highlight": "It was only the second time this season that Miami won a game by more than seven points, and ended a streak of six consecutive single-digit games for ...","is_target": false},{"rank": 3,"doc_id": "176398_report","teams": ["Miami Heat","Chicago Bulls"],"highlight": "They improved to 10-0 at home this season, extending the best home start in franchise history.. \n\"I don't shy away from taking the big shot,\" Herro sa...","is_target": false}]}},{"turn": 6,"tool": "search_documents","abbrev": "SD","thought": "Another search attempt with different keywords.","arguments": {"query": "\"more than triple his usual first-quarter points for the season\""},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "1003554_report","teams": ["Phoenix Suns","Cleveland Cavaliers"],"highlight": "... Made 8 of 12 3-pointers (66.7%) in the first half. ...","is_target": false},{"rank": 2,"doc_id": "1003459_report","teams": ["Houston Rockets","Portland Trail Blazers"],"highlight": "I\u2019m more proud of him for that than the 32 points because he can do that most nights.\u201d. \n...","is_target": false},{"rank": 3,"doc_id": "176367_report","teams": ["Golden State Warriors","Charlotte Hornets"],"highlight": "... Graham has made at least three 3-pointers in 15 games this season. ...","is_target": false}]}},{"turn": 7,"tool": "document_qa","abbrev": "DQ","thought": "Ask candidate reports whether a Heat player tripled his Q1 scoring.","arguments": {"doc_ids": ["1006446_report","985017_report","618058_report","204676_report","1003662_report","400288_report"],"query": "Does this report mention a Miami Heat player who scored more than triple his usual first-quarter points for the season? If yes, name the player and specify the shot type of his very first made basket of the night."},"results": {"kind": "docqa","total": 6,"target_count": 0,"target_ranks": [],"top": [],"results": [{"doc_id": "1006446_report","answer": "The document does not mention any Miami Heat player who scored more than triple his usual first-quarter points for the season. The document provides overall scoring totals for Hea...","is_target": false,"contains_answer": false},{"doc_id": "985017_report","answer": "The document does not mention any Miami Heat player scored more than triple his usual first-quarter points for the season. The document reports overall scoring stats for the game but does not provide spec...","is_target": false,"contains_answer": false},{"doc_id": "618058_report","answer": "The document does not mention any Miami Heat player scoring more than triple his usual first-quarter points, nor does it specify any shot types for first-quarter baskets\u2026","is_target": false,"contains_answer": false}]}},{"turn": 8,"tool": "search_documents","abbrev": "SD","thought": "Reports came back empty. Try more search queries.","arguments": {"query": "Heat more than triple his usual first quarter points for the season"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "985017_report","teams": ["Charlotte Hornets","Miami Heat"],"highlight": "It was only the second time this season that Miami won a game by more than seven points, and ended a streak of six consecutive single-digit games for ...","is_target": false},{"rank": 2,"doc_id": "176398_report","teams": ["Miami Heat","Chicago Bulls"],"highlight": "They improved to 10-0 at home this season, extending the best home start in franchise history.. \n\"I don't shy away from taking the big shot,\" Herro sa...","is_target": false},{"rank": 3,"doc_id": "405021_report","teams": ["Miami Heat"],"highlight": "Heat: Had 13 turnovers in the first half, including nine in the second quarter -- the most they've had in any quarter this season.. \nHornets: Charlott...","is_target": false}]}},{"turn": 9,"tool": "document_qa","abbrev": "DQ","thought": "Ask another batch of reports the same question.","arguments": {"doc_ids": ["985017_report"],"query": "Which Miami Heat player is said to have scored more than triple his usual first-quarter points for the season in this game, and what was the shot type of his very first made basket of the night?"},"results": {"kind": "docqa","total": 1,"target_count": 0,"target_ranks": [],"top": [],"results": [{"doc_id": "985017_report","answer": "The document does not specify which Miami Heat player scored more than triple his usual first-quarter points for the season in this game, nor does it mention the shot type of his...","is_target": false,"contains_answer": false}]}},{"turn": 10,"tool": "document_qa","abbrev": "DQ","thought": "Check one more report for the Heat scoring spike.","arguments": {"doc_ids": ["618468_report"],"query": "Does this report say a Miami Heat player scored more than triple his usual first-quarter points for the season? If yes, who is the player and what was the shot type of his very first made basket of the night?"},"results": {"kind": "docqa","total": 1,"target_count": 0,"target_ranks": [],"top": [],"results": [{"doc_id": "618468_report","answer": "The document does not mention any Miami Heat player scored more than triple his usual first-quarter points for the season. The document mentions Herro had 14 points in the first quarter af...","is_target": false,"contains_answer": false}]}},{"turn": 11,"tool": "search_documents","abbrev": "SD","thought": "Back to searching. Running out of candidates.","arguments": {"query": "Miami Heat more than triple his usual first quarter points for the season first made basket shot type","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "204676_report","teams": ["Houston Rockets","Miami Heat"],"highlight": "It was a record-setting opening quarter for the Heat -- resulting in the third-biggest lead after 12 minutes in the NBA's shot-clock era, starting wit...","is_target": false},{"rank": 2,"doc_id": "985017_report","teams": ["Charlotte Hornets","Miami Heat"],"highlight": "Miami outscored Charlotte 45-25 in the third quarter, tying the sixth-highest scoring quarter in any period in Heat history.. \n\u201cI liked the way the fl...","is_target": false},{"rank": 3,"doc_id": "405021_report","teams": ["Miami Heat"],"highlight": "Heat: Had 13 turnovers in the first half, including nine in the second quarter -- the most they've had in any quarter this season.. \nHornets: Charlott...","is_target": false}]}},{"turn": 12,"tool": "search_documents","abbrev": "SD","thought": "Try yet another query variation.","arguments": {"query": "more than triple his usual first quarter points","teams": ["Miami Heat"]},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "204548_report","teams": ["Atlanta Hawks","Miami Heat"],"highlight": "He had four 3s in the first 8 minutes on Tuesday -- after never having previously made more than two in any quarter of his first 138 NBA games.. \nUP N...","is_target": false},{"rank": 2,"doc_id": "867791_report","teams": ["Golden State Warriors","Miami Heat"],"highlight": "The reigning scoring champion scored his first points on a 3-pointer at the 7:45 mark of the second quarter and quickly had seven points. ...","is_target": false},{"rank": 3,"doc_id": "1030480_report","teams": ["Milwaukee Bucks","Miami Heat"],"highlight": "He had 22 of Miami's 28 first-quarter points, including 20 in a row over a span of 5:45 late in the period.. \nAnd in the fourth, he had 21 more - lead...","is_target": false}]}},{"turn": 13,"tool": "document_qa","abbrev": "DQ","thought": "Last DQ attempt: ask remaining candidate reports.","arguments": {"doc_ids": ["204548_report"],"query": "Does this report state that a Miami Heat player scored more than triple his usual first-quarter points for the season? If yes, who is the player and what was the shot type of his very first made basket of the night?"},"results": {"kind": "docqa","total": 1,"target_count": 0,"target_ranks": [],"top": [],"results": [{"doc_id": "204548_report","answer": "The document does not mention any Miami Heat player scored more than triple their usual first-quarter points for the season. The document does mention that Jimmy Butler made his first four...","is_target": false,"contains_answer": false}]}},{"turn": 14,"tool": "search_documents","abbrev": "SD","thought": "Resume searching with broader terms.","arguments": {"query": "Heat \"first made basket of the night\"","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "351674_report","teams": ["Boston Celtics","Miami Heat"],"highlight": "--Jayson Tatumthought he had a dunk to tie the game.. \nBam Adebayohad other ideas -- and in the biggest moment of his young NBA career, Miami's All-St...","is_target": false},{"rank": 2,"doc_id": "343587_report","teams": ["Milwaukee Bucks","Miami Heat"],"highlight": "Butler got the first one to bounce home, made a second one that was irrelevant, and the Heat grabbed control of their East semifinal matchup with a 11...","is_target": false},{"rank": 3,"doc_id": "732367_report","teams": ["Charlotte Hornets","Miami Heat"],"highlight": "Heat: Had 30 assists on 45 made baskets. ...","is_target": false}]}},{"turn": 15,"tool": "search_documents","abbrev": "SD","thought": "Still can't find the right report.","arguments": {"query": "Miami Heat more than triple his usual first quarter points this season","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "405021_report","teams": ["Miami Heat"],"highlight": "Heat: Had 13 turnovers in the first half, including nine in the second quarter -- the most they've had in any quarter this season.. \nHornets: Charlott...","is_target": false},{"rank": 2,"doc_id": "985017_report","teams": ["Charlotte Hornets","Miami Heat"],"highlight": "It was only the second time this season that Miami won a game by more than seven points, and ended a streak of six consecutive single-digit games for ...","is_target": false},{"rank": 3,"doc_id": "176398_report","teams": ["Miami Heat","Chicago Bulls"],"highlight": "They improved to 10-0 at home this season, extending the best home start in franchise history.. \n\"I don't shy away from taking the big shot,\" Herro sa...","is_target": false}]}},{"turn": 16,"tool": "search_documents","abbrev": "SD","thought": "Final search attempt.","arguments": {"query": "\"triple his usual first quarter points\""},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"doc_id": "1003554_report","teams": ["Phoenix Suns","Cleveland Cavaliers"],"highlight": "... Made 8 of 12 3-pointers (66.7%) in the first half. ...","is_target": false},{"rank": 2,"doc_id": "402255_report","teams": ["Detroit Pistons"],"highlight": "The Detroit star already had a triple-double after three quarters, but it was a difficult fourth for him. ...","is_target": false},{"rank": 3,"doc_id": "1033404_report","teams": ["Phoenix Suns","Denver Nuggets"],"highlight": "He scored 18 points in the first quarter of Game 3.. \n------. \n\n... He was back in his usual seats in the second half.. \nAYTON'S BIG OVATION. \n...","is_target": false}]}}],"final_answer": "I cannot find the answer in the provided documents or videos.","final_thought": "Only looks at reports. Never opens a single video clip, then gives up.","tool_summaries": [{"abbrev": "SD","key": "search_documents","text": "Searched game reports 12 times looking for the Heat game. Found several candidates but never confirmed the right one."},{"abbrev": "DQ","key": "document_qa","text": "Asked 4 reports whether a Heat player tripled his usual first-quarter scoring. None contained the answer."},{"abbrev": "A","key": null,"text": "Refused to answer.","fail": "Never searched stat documents to identify the player, and never opened a video clip to see the shot type."}]},'perception_bn': {"question_id": "perception_bn","question": "In the game where New Jersey won back-to-back road games for the first time that season and also had an offside call on Yegor Sharangovich near the end of the first period, how many takeaways happened from the opening faceoff up to (and including) the puck battle between Jonas Siegenthaler and Brayden Schenn early in Period 1?","model": "GPT-5.2","mode": "non-oracle","gt_answer": "2","verdict": "Wrong","num_turns": 18,"tool_counts": {"search_documents": 2,"document_qa": 1,"search_videos": 5,"video_qa": 10},"phases": [{"start_turn": 1,"end_turn": 3,"label": "Find the game"},{"start_turn": 4,"end_turn": 9,"label": "Watch clips, count takeaways"},{"start_turn": 10,"end_turn": 18,"label": "Rewatch, numbers don't add up"},{"start_turn": 19,"end_turn": 19,"label": "Wrong"}],"turns": [{"turn": 1,"tool": "search_documents","abbrev": "SD","thought": "Search reports for the game where NJ won back-to-back road games with a Sharangovich offside.","arguments": {"query": "back-to-back road games for the first time this season offside call on Yegor Sharangovich near the end of the first period","doc_type": "report"},"results": {"kind": "documents","total": 20,"target_count": 0,"target_ranks": [],"top": [{"rank": null,"doc_id": "682226_report","teams": ["Calgary Flames","Minnesota Wild"],"highlight": "He scored his eighth goal of the season in the first period.. \nSharangovich is on his own scoring streak, scoring for the fourth straight game. ","is_target": false},{"rank": null,"doc_id": "229098_report","teams": ["Tampa Bay Lightning","Chicago Blackhawks"],"highlight": "On the next shift, Tampa Bay was called for an intentional offside call, sending the faceoff back to the Lightning zone. ","is_target": false},{"rank": null,"doc_id": "437522_report","teams": ["New York Rangers","New Jersey Devils"],"highlight": "Sharangovich got 17 minutes in penalties and a cut on his head, and did not return.. \n\u201cI think he probably overreacted a little bit. ","is_target": false}]}},{"turn": 2,"tool": "document_qa","abbrev": "DQ","thought": "Check the NJD-STL report for the Sharangovich offside call.","arguments": {"doc_ids": ["437393_report"],"query": "Does this game report mention an offside call on Yegor Sharangovich near the end of the first period? If so, what exactly does it say?"},"results": {"kind": "docqa","results": [{"doc_id": "437393_report","answer": "No, the game report does not mention an offside call on Yegor Sharangovich near the end of the first period. The document only mentions that Sharangovich scored during the third period, specifically: 'Sharangovich tied\u2026","is_target": true,"contains_answer": false}]}},{"turn": 3,"tool": "search_documents","abbrev": "SD","thought": "Filter search to NJ Devils. Confirm game 437393 vs St. Louis.","arguments": {"query": "New Jersey won back-to-back road games for the first time this season offside Sharangovich end of the first period","doc_type": "report","teams": ["New Jersey Devils"]},"results": {"kind": "documents","total": 20,"target_count": 1,"target_ranks": [3],"top": [{"rank": null,"doc_id": "437424_report","teams": ["New York Rangers","New Jersey Devils"],"highlight": "New Jersey even had a goal disallowed for offside following a Rangers replay challenge before Sharangovich extended the cushion to 5-2 with his 16th at 18:07.. \nMercer continued h\u2026","is_target": false},{"rank": null,"doc_id": "576290_report","teams": ["New Jersey Devils","Toronto Maple Leafs"],"highlight": "TORONTO -- \u2014 Yegor Sharangovich scored 57 seconds into overtime, Vitek Vanecek made 25 saves and the New Jersey Devils beat the Toronto Maple Leafs 3-2 on Thursday for their 11th\u2026","is_target": false},{"rank": null,"doc_id": "437393_report","teams": ["New Jersey Devils","St. Louis Blues"],"highlight": "Louis Blues on Thursday night.. \nNew Jersey, playing its third game in four nights, won back-to-back road games for the first time this season after beating Montreal on Tuesday..\u2026","is_target": true}]}},{"turn": 4,"tool": "search_videos","abbrev": "SV","thought": "Search for opening faceoff clips in game 437393, Period 1.","arguments": {"query": "opening faceoff","game_ids": ["437393"],"period": 1},"results": {"kind": "videos","total": 100,"target_count": 2,"target_ranks": [18,34],"top": [{"rank": 1,"clip_id": "437393_68","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_68.jpg","clip": "assets/t9_clips/clip_437393_68.mp4"},{"rank": 2,"clip_id": "437393_25","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_25.jpg","clip": "assets/t9_clips/clip_437393_25.mp4"},{"rank": 3,"clip_id": "437393_70","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_70.jpg","clip": "assets/t9_clips/clip_437393_70.mp4"}]}},{"turn": 5,"tool": "video_qa","abbrev": "VQ","thought": "Watch clip 0 to check if it's the opening faceoff.","arguments": {"video_ids": ["437393_0"],"query": "What is the sequence of actions taking place in this hockey clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "437393_0","answer": "Scott Laughton (#21) faces off against Ryan O'Reilly (#90) in the Neutral Zone during the New Jersey Devils vs. St. Louis Blues game.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_437393_0.jpg","clip": "assets/t9_clips/clip_437393_0.mp4"}]}},{"turn": 6,"tool": "video_qa","abbrev": "VQ","thought": "Ask clip 1 whether it shows the Period 1 opening faceoff.","arguments": {"video_ids": ["437393_1"],"query": "Does this clip show the opening faceoff to start Period 1? Answer yes or no."},"results": {"kind": "videoqa","results": [{"clip_id": "437393_1","answer": "Unable to identify the actions in this clip clearly.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_437393_1.jpg","clip": "assets/t9_clips/clip_437393_1.mp4"}]}},{"turn": 7,"tool": "video_qa","abbrev": "VQ","thought": "Inspect clip 44 for relevant actions.","arguments": {"video_ids": ["437393_44"],"query": "What is the atomic action shown in this hockey video clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "437393_44","answer": "Ashton Parayko (#55) controls the puck in the Offensive Zone and passes to Janne Kuokkanen (#29).","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_437393_44.jpg","clip": "assets/t9_clips/clip_437393_44.mp4"}]}},{"turn": 8,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 6 for the Siegenthaler-Schenn puck battle.","arguments": {"video_ids": ["437393_6"],"query": "Is there a puck battle between Jonas Siegenthaler and Brayden Schenn in this clip? Answer yes or no."},"results": {"kind": "videoqa","results": [{"clip_id": "437393_6","answer": "No. The clip shows Erik Haula (#56) passing to P.K. Subban (#76). Siegenthaler and Schenn are not visible.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_437393_6.jpg","clip": "assets/t9_clips/clip_437393_6.mp4"}]}},{"turn": 9,"tool": "video_qa","abbrev": "VQ","thought": "Inspect clip 3 for actions and possible takeaways.","arguments": {"video_ids": ["437393_3"],"query": "What is the atomic action shown in this hockey video clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "437393_3","answer": "Zach Sanford (#13) faces off with David Perron (#57) in the Offensive Zone.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_437393_3.jpg","clip": "assets/t9_clips/clip_437393_3.mp4"}]}},{"turn": 10,"tool": "search_videos","abbrev": "SV","thought": "Search specifically for the Siegenthaler vs Schenn puck battle.","arguments": {"query": "puck battle Jonas Siegenthaler Brayden Schenn","game_ids": ["437393"],"period": 1,"players": ["Jonas Siegenthaler","Brayden Schenn"]},"results": {"kind": "videos","total": 65,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"clip_id": "437393_17","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_17.jpg","clip": "assets/t9_clips/clip_437393_17.mp4"},{"rank": 2,"clip_id": "437393_82","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_82.jpg","clip": "assets/t9_clips/clip_437393_82.mp4"},{"rank": 3,"clip_id": "437393_44","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_44.jpg","clip": "assets/t9_clips/clip_437393_44.mp4"}]}},{"turn": 11,"tool": "video_qa","abbrev": "VQ","thought": "Re-check clip 6 for Siegenthaler-Schenn. Not found.","arguments": {"video_ids": ["437393_6"],"query": "Does this clip show a puck battle between Jonas Siegenthaler and Brayden Schenn? Answer only yes or no."},"results": {"kind": "videoqa","results": [{"clip_id": "437393_6","answer": "No. Erik Haula (#56) passes to Nils Lundkvist (#27). No puck battle between Siegenthaler and Schenn.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_437393_6.jpg","clip": "assets/t9_clips/clip_437393_6.mp4"}]}},{"turn": 12,"tool": "video_qa","abbrev": "VQ","thought": "Ask clip 6 to list all players in puck battles. Still no match.","arguments": {"video_ids": ["437393_6"],"query": "Which players are engaged in the puck battle in this hockey clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "437393_6","answer": "Dawson Mercer (#18) and Robert Thomas (#18) are involved. No sign of Siegenthaler or Schenn.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_437393_6.jpg","clip": "assets/t9_clips/clip_437393_6.mp4"}]}},{"turn": 13,"tool": "search_videos","abbrev": "SV","thought": "Search for takeaway clips across the full Period 1 window.","arguments": {"query": "takeaway","game_ids": ["437393"],"period": 1,"temporal_boundary": "0-725.287"},"results": {"kind": "videos","total": 55,"target_count": 2,"target_ranks": [12,25],"top": [{"rank": 1,"clip_id": "437393_45","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_45.jpg","clip": "assets/t9_clips/clip_437393_45.mp4"},{"rank": 2,"clip_id": "437393_21","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_21.jpg","clip": "assets/t9_clips/clip_437393_21.mp4"},{"rank": 3,"clip_id": "437393_15","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_15.jpg","clip": "assets/t9_clips/clip_437393_15.mp4"}]}},{"turn": 14,"tool": "video_qa","abbrev": "VQ","thought": "Fourth attempt on clip 6. Siegenthaler-Schenn still not found.","arguments": {"video_ids": ["437393_6"],"query": "Describe the sequence of actions in this clip, and state whether Jonas Siegenthaler and Brayden Schenn battle for the puck."},"results": {"kind": "videoqa","results": [{"clip_id": "437393_6","answer": "Pavel Buchnevich (#89) passes to Marco Scandella (#6), then to Torey Krug (#47). No Siegenthaler or Schenn puck battle in this clip.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_437393_6.jpg","clip": "assets/t9_clips/clip_437393_6.mp4"}]}},{"turn": 15,"tool": "search_videos","abbrev": "SV","thought": "Tighten takeaway search to first 100 seconds of Period 1.","arguments": {"query": "takeaway","game_ids": ["437393"],"period": 1,"temporal_boundary": "0-100.144"},"results": {"kind": "videos","total": 45,"target_count": 2,"target_ranks": [8,19],"top": [{"rank": 1,"clip_id": "437393_6","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_6.jpg","clip": "assets/t9_clips/clip_437393_6.mp4"},{"rank": 2,"clip_id": "437393_1","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_1.jpg","clip": "assets/t9_clips/clip_437393_1.mp4"},{"rank": 3,"clip_id": "437393_7","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_7.jpg","clip": "assets/t9_clips/clip_437393_7.mp4"}]}},{"turn": 16,"tool": "video_qa","abbrev": "VQ","thought": "Ask clip 0 to count takeaways directly.","arguments": {"video_ids": ["437393_0"],"query": "How many takeaways occur in this hockey clip? Answer with a single number."},"results": {"kind": "videoqa","results": [{"clip_id": "437393_0","answer": "I see faceoffs and passes but no clear takeaway in this clip.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_437393_0.jpg","clip": "assets/t9_clips/clip_437393_0.mp4"}]}},{"turn": 17,"tool": "search_videos","abbrev": "SV","thought": "Search the very start of the game, first 30 seconds.","arguments": {"query": "opening faceoff start of game","game_ids": ["437393"],"period": 1,"temporal_boundary": "0-30"},"results": {"kind": "videos","total": 40,"target_count": 1,"target_ranks": [11],"top": [{"rank": 1,"clip_id": "437393_0","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_0.jpg","clip": "assets/t9_clips/clip_437393_0.mp4"},{"rank": 2,"clip_id": "437393_2","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_2.jpg","clip": "assets/t9_clips/clip_437393_2.mp4"},{"rank": 3,"clip_id": "437393_1","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_437393_1.jpg","clip": "assets/t9_clips/clip_437393_1.mp4"}]}},{"turn": 18,"tool": "video_qa","abbrev": "VQ","thought": "Batch-query clips 0-6 for takeaway counts. Responses are noisy.","arguments": {"video_ids": ["437393_0","437393_1","437393_2","437393_3","437393_4","437393_5","437393_6"],"query": "How many takeaways occur in this hockey clip? Answer with a single integer (0, 1, 2, ...)."},"results": {"kind": "videoqa","results": [{"clip_id": "437393_0","answer": "3 takeaways seen in this clip.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_437393_0.jpg","clip": "assets/t9_clips/clip_437393_0.mp4"},{"clip_id": "437393_1","answer": "Two takeaway actions observed in this clip.","is_target": true,"has_answer": false,"frame": "assets/t9_frames/clip_437393_1.jpg","clip": "assets/t9_clips/clip_437393_1.mp4"},{"clip_id": "437393_2","answer": "0 takeaways in this clip.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_437393_2.jpg","clip": "assets/t9_clips/clip_437393_2.mp4"}]}}],"final_answer": "8","final_thought": "Watched 10 clips. Couldn't confirm the Siegenthaler-Schenn boundary. Takeaway counts were noisy. Got 8, GT was 2.","tool_summaries": [{"abbrev": "SD","key": "search_documents","text": "Searched for the game report twice. Second search returned the NJ vs St. Louis report."},{"abbrev": "DQ","key": "document_qa","text": "Confirmed the game from the report. Back-to-back road wins matched."},{"abbrev": "SV","key": "search_videos","text": "Searched for clips from the opening faceoff through the Siegenthaler-Schenn puck battle. Five search attempts."},{"abbrev": "VQ","key": "video_qa","text": "Asked 10 clips to identify actions and count takeaways. Most couldn't identify players reliably. Takeaway counts were noisy and inconsistent."},{"abbrev": "A","key": null,"text": "Settled on 8. The correct answer was 2."}]},'aggregation_fail': {"question_id": "aggregation_fail","question": "In the match where Arsenal\u2019s first-half corner count was unusually high compared with Tottenham\u2019s, focus on the first-half moment when Tottenham\u2019s D. Spence committed a foul on R. Sterling after losing a defensive ground duel on the right side; who was the Arsenal player that had just won the interception and immediately passed to Sterling to start that chain?","model": "GPT-5.2","mode": "non-oracle","gt_answer": "cross","verdict": "Wrong","num_turns": 23,"tool_counts": {"search_videos": 7,"search_documents": 1,"document_qa": 1,"video_qa": 14},"phases": [{"start_turn": 1,"end_turn": 5,"label": "Search for corner-kick clips"},{"start_turn": 6,"end_turn": 7,"label": "Confirm the game"},{"start_turn": 8,"end_turn": 17,"label": "Watch clips one by one"},{"start_turn": 18,"end_turn": 23,"label": "Still watching, never adding up"},{"start_turn": 24,"end_turn": 24,"label": "Wrong"}],"turns": [{"turn": 1,"tool": "search_videos","abbrev": "SV","thought": "Search for the Spence-Sterling foul clip across Arsenal-Tottenham first halves.","arguments": {"query": "D. Spence foul on R. Sterling right side ground duel first half","teams": ["Arsenal","Tottenham"],"period": 1},"results": {"kind": "videos","total": 100,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"clip_id": "5234996_166","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5234996_166.jpg","clip": "assets/t9_clips/clip_5234996_166.mp4"},{"rank": 2,"clip_id": "5588165_122","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5588165_122.jpg","clip": "assets/t9_clips/clip_5588165_122.mp4"},{"rank": 3,"clip_id": "5234996_44","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5234996_44.jpg","clip": "assets/t9_clips/clip_5234996_44.mp4"}]}},{"turn": 2,"tool": "search_videos","abbrev": "SV","thought": "Try a specific game ID. No results.","arguments": {"query": "Spence foul Sterling","game_ids": ["5354553"],"players": ["D. Spence","R. Sterling"],"period": 1},"results": {"kind": "videos","total": 85,"target_count": 0,"target_ranks": [],"top": []}},{"turn": 3,"tool": "search_videos","abbrev": "SV","thought": "Widen query to just 'Sterling foul' in Arsenal-Tottenham matches.","arguments": {"query": "Sterling foul","teams": ["Arsenal","Tottenham Hotspur"],"period": 1},"results": {"kind": "videos","total": 75,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"clip_id": "5234996_44","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5234996_44.jpg","clip": "assets/t9_clips/clip_5234996_44.mp4"},{"rank": 2,"clip_id": "5464988_113","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5464988_113.jpg","clip": "assets/t9_clips/clip_5464988_113.mp4"},{"rank": 3,"clip_id": "5235156_11","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5235156_11.jpg","clip": "assets/t9_clips/clip_5235156_11.mp4"}]}},{"turn": 4,"tool": "search_videos","abbrev": "SV","thought": "Try unfiltered search for Spence and Sterling foul.","arguments": {"query": "Spence Sterling foul"},"results": {"kind": "videos","total": 60,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"clip_id": "5241523_30","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5241523_30.jpg","clip": "assets/t9_clips/clip_5241523_30.mp4"},{"rank": 2,"clip_id": "5354773_91","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5354773_91.jpg","clip": "assets/t9_clips/clip_5354773_91.mp4"},{"rank": 3,"clip_id": "5464988_113","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5464988_113.jpg","clip": "assets/t9_clips/clip_5464988_113.mp4"}]}},{"turn": 5,"tool": "search_videos","abbrev": "SV","thought": "Search broadly for any D. Spence foul in first halves.","arguments": {"query": "D. Spence foul","period": 1},"results": {"kind": "videos","total": 55,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"clip_id": "5241523_30","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5241523_30.jpg","clip": "assets/t9_clips/clip_5241523_30.mp4"},{"rank": 2,"clip_id": "5361866_15","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5361866_15.jpg","clip": "assets/t9_clips/clip_5361866_15.mp4"},{"rank": 3,"clip_id": "5592508_115","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5592508_115.jpg","clip": "assets/t9_clips/clip_5592508_115.mp4"}]}},{"turn": 6,"tool": "search_documents","abbrev": "SD","thought": "Switch to documents to find which match had unusually high Arsenal corners.","arguments": {"query": "Arsenal Tottenham first half corners","doc_type": "game_stat_team","teams": ["Arsenal","Tottenham Hotspur"]},"results": {"kind": "documents","total": 20,"target_count": 1,"target_ranks": [2],"top": [{"rank": null,"doc_id": "5354553_game_stat_team","teams": ["Arsenal","Tottenham Hotspur"],"highlight": "## 1st Half. \n\n... Arsenal: 1 goals, 7 shots (4 on target), 221/250 passes (88.4%), 2 key passes, 34 tackles (6 won), 15 interceptions, 8 fouls, 4 corners. \n\n... ## 2nd Half. \n\n..\u2026","is_target": false},{"rank": null,"doc_id": "5588280_game_stat_team","teams": ["Arsenal","Tottenham Hotspur"],"highlight": "Tottenham Hotspur: 1 goals, 2 shots (2 on target), 103/129 passes (79.8%), 25 tackles (8 won), 23 interceptions, 6 fouls, 1 yellow cards, 3 corners. \n\n... Arsenal: 1 goals, 5 shot\u2026","is_target": true},{"rank": null,"doc_id": "5354809_game_stat_team","teams": ["Liverpool","Tottenham Hotspur"],"highlight": "## 1st Half. \n\n... Tottenham Hotspur: 1 goals, 4 shots (4 on target), 110/139 passes (79.1%), 2 key passes, 42 tackles (7 won), 12 interceptions, 5 fouls, 1 corners. \n\n... ## 2nd\u2026","is_target": false}]}},{"turn": 7,"tool": "document_qa","abbrev": "DQ","thought": "Confirm game 5588280: Arsenal 7 corners vs Tottenham 3 in first half.","arguments": {"doc_ids": ["5588280_game_stat_team"],"query": "What were the first-half corner counts for Arsenal and for Tottenham Hotspur in this match?"},"results": {"kind": "docqa","results": [{"doc_id": "5588280_game_stat_team","answer": "In the first half, Tottenham Hotspur had 3 corners and Arsenal had 7 corners.","is_target": true,"contains_answer": false}]}},{"turn": 8,"tool": "search_videos","abbrev": "SV","thought": "Search for the foul sequence within the confirmed match.","arguments": {"query": "Sterling fouled Spence right side ground duel interception pass","game_ids": ["5588280"],"period": 1},"results": {"kind": "videos","total": 50,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"clip_id": "5588280_16","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5588280_16.jpg","clip": "assets/t9_clips/clip_5588280_16.mp4"},{"rank": 2,"clip_id": "5588280_142","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5588280_142.jpg","clip": "assets/t9_clips/clip_5588280_142.mp4"},{"rank": 3,"clip_id": "5588280_172","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5588280_172.jpg","clip": "assets/t9_clips/clip_5588280_172.mp4"}]}},{"turn": 9,"tool": "video_qa","abbrev": "VQ","thought": "Ask clip 145 about the interception-to-Sterling chain.","arguments": {"video_ids": ["5588280_145"],"query": "Who is the Arsenal player that wins the interception and immediately passes to R. Sterling to start the chain of play in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_145","answer": "Gabriel Magalhaes, the left center-back for Arsenal, intercepted the ball and carried it forward before executing a header pass, a short to medium progressive pass during a counterpressing recovery. D. Rice, playing as\u2026","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_145.jpg","clip": "assets/t9_clips/clip_5588280_145.mp4"}]}},{"turn": 10,"tool": "video_qa","abbrev": "VQ","thought": "Re-ask clip 145 with rephrased query. Still no match.","arguments": {"video_ids": ["5588280_145"],"query": "What is the name of the Arsenal player who plays the immediate pass to R. Sterling right after winning the interception in this clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_145","answer": "B. Saka, playing as the right-wing forward for Arsenal, executed a successful forward pass to D. Rice in the right central midfield position during the match against Tottenham Hotspur.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_145.jpg","clip": "assets/t9_clips/clip_5588280_145.mp4"}]}},{"turn": 11,"tool": "video_qa","abbrev": "VQ","thought": "Verify whether clip 145 contains the Spence-Sterling foul at all.","arguments": {"video_ids": ["5588280_145"],"query": "Does this clip show Tottenham's D. Spence committing a foul on Arsenal's R. Sterling? If yes, where on the pitch does it occur (left/center/right)?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_145","answer": "A. Lallana, playing as a left defensive midfielder for Tottenham Hotspur, intercepted a forward pass. D. Solanke, in a striker role for Arsenal, engaged in a duel with D. Udogie, the left back for Tottenham, while maint\u2026","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_145.jpg","clip": "assets/t9_clips/clip_5588280_145.mp4"}]}},{"turn": 12,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 132 for the Spence-Sterling foul sequence.","arguments": {"video_ids": ["5588280_132"],"query": "Does this clip show Tottenham's D. Spence committing a foul on Arsenal's R. Sterling? If yes, describe the sequence immediately before the foul (including whether there is an interception and who passes to Sterling)."},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_132","answer": "D. Spence of Tottenham Hotspur executed a clearance, but the ball went out of play, leading to a throw-in taken by B. White of Arsenal.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_132.jpg","clip": "assets/t9_clips/clip_5588280_132.mp4"}]}},{"turn": 13,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 158: finds B. White interception but no Sterling link.","arguments": {"video_ids": ["5588280_158"],"query": "Does this clip show Tottenham's D. Spence committing a foul on Arsenal's R. Sterling after losing a defensive ground duel on the right side? If yes, who is the Arsenal player that wins the interception and immediately passes to Sterling to start the chain?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_158","answer": "B. White, playing right back for Arsenal, executed a headed pass interception while D. Spence, the left back for Tottenham Hotspur, committed a foul.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_158.jpg","clip": "assets/t9_clips/clip_5588280_158.mp4"}]}},{"turn": 14,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 135 for interception-to-Sterling chain.","arguments": {"video_ids": ["5588280_135"],"query": "In this clip, who is the Arsenal player that wins an interception and immediately plays the pass to R. Sterling?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_135","answer": "B. White, the right back for Arsenal, attempted an unsuccessful forward pass to D. Kulusevski, who is positioned as a right central midfielder for Tottenham Hotspur, resulting in an interception of the ball.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_135.jpg","clip": "assets/t9_clips/clip_5588280_135.mp4"}]}},{"turn": 15,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 108 for the foul sequence.","arguments": {"video_ids": ["5588280_108"],"query": "Does this clip show Tottenham's D. Spence fouling Arsenal's R. Sterling (after a ground duel on the right side)? If yes, who is the Arsenal player that wins the interception and immediately passes to Sterling to start that sequence?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_108","answer": "P. H\u00f8jbjerg, playing as a left winger for Tottenham Hotspur, attempted an unsuccessful forward pass to R. Sterling, who was flagged offside during the match against Arsenal.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_108.jpg","clip": "assets/t9_clips/clip_5588280_108.mp4"}]}},{"turn": 16,"tool": "video_qa","abbrev": "VQ","thought": "Re-examine clip 158 for full action sequence.","arguments": {"video_ids": ["5588280_158"],"query": "What is the sequence of actions that takes place in this soccer clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_158","answer": "D. Gray, the left-back for Tottenham Hotspur, executed a successful forward pass to D. Kulusevski, who then completed a short pass back to Gray. Gray followed this with another short pass to Kulusevski, who delivered a\u2026","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_158.jpg","clip": "assets/t9_clips/clip_5588280_158.mp4"}]}},{"turn": 17,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 144. B. White interception again, but no Sterling.","arguments": {"video_ids": ["5588280_144"],"query": "Does this clip show Tottenham's D. Spence committing a foul on Arsenal's R. Sterling? If yes, who is the Arsenal player that wins the interception and immediately passes to Sterling right before the foul?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_144","answer": "Y. Bissouma of Tottenham Hotspur attempted an unsuccessful forward pass to B. White, who then executed a successful forward pass to Gabriel Martinelli. L. Bergvall engaged in a duel with Martinelli but lost possession,\u2026","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_144.jpg","clip": "assets/t9_clips/clip_5588280_144.mp4"}]}},{"turn": 18,"tool": "search_videos","abbrev": "SV","thought": "Re-search with reworded query. No new leads.","arguments": {"query": "foul Sterling Spence","game_ids": ["5588280"],"period": 1},"results": {"kind": "videos","total": 45,"target_count": 0,"target_ranks": [],"top": [{"rank": 1,"clip_id": "5588280_16","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5588280_16.jpg","clip": "assets/t9_clips/clip_5588280_16.mp4"},{"rank": 2,"clip_id": "5588280_142","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5588280_142.jpg","clip": "assets/t9_clips/clip_5588280_142.mp4"},{"rank": 3,"clip_id": "5588280_172","quarter": null,"is_target": false,"frame": "assets/t9_frames/clip_5588280_172.jpg","clip": "assets/t9_clips/clip_5588280_172.mp4"}]}},{"turn": 19,"tool": "video_qa","abbrev": "VQ","thought": "Third attempt at clip 145. Just a throw-in.","arguments": {"video_ids": ["5588280_145"],"query": "What is the sequence of actions that takes place in this soccer clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_145","answer": "D. Kulusevski of Tottenham Hotspur executed a touch that resulted in the ball going out of play. Gabriel Jesus of Arsenal then performed a throw-in. The teams competing are Arsenal and Tottenham Hotspur.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_145.jpg","clip": "assets/t9_clips/clip_5588280_145.mp4"}]}},{"turn": 20,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 137. B. White interception again, no Sterling foul.","arguments": {"video_ids": ["5588280_137"],"query": "Does this clip show Tottenham's D. Spence committing a foul on Arsenal's R. Sterling after a defensive ground duel on the right side? If yes, who is the Arsenal player that wins the interception and immediately passes to Sterling to start that chain?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_137","answer": "B. White, playing as the right center-back for Arsenal, executed an interception to recover possession during counter-pressing and then delivered a short to medium pass. D. Rice, positioned as a left-centered midfielder\u2026","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_137.jpg","clip": "assets/t9_clips/clip_5588280_137.mp4"}]}},{"turn": 21,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 98. Spence loses a duel but not the target foul.","arguments": {"video_ids": ["5588280_98"],"query": "Does this clip show Tottenham's D. Spence committing a foul on Arsenal's R. Sterling after losing a defensive ground duel on the right side? If yes, who is the Arsenal player that wins the interception and immediately passes to Sterling to start that chain?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_98","answer": "D. Spence, playing left back, engaged in a duel with B. Saka, positioned as a right attacking midfielder, but lost possession. W. Odobert, the center forward for Tottenham Hotspur, accelerated with a progressive run whi\u2026","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_98.jpg","clip": "assets/t9_clips/clip_5588280_98.mp4"}]}},{"turn": 22,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 86. Unrelated duel.","arguments": {"video_ids": ["5588280_86"],"query": "Does this clip show Tottenham's D. Spence committing a foul on Arsenal's R. Sterling after losing a defensive ground duel on the right side? If yes, who is the Arsenal player that wins the interception and immediately passes to Sterling to start that chain?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_86","answer": "Gabriel Magalhaes, playing as left center back, engaged in a duel with D. Kulusevski from Tottenham Hotspur and lost possession. J. Maddison, positioned as right midfielder, executed a successful short pass to goalkeepe\u2026","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_86.jpg","clip": "assets/t9_clips/clip_5588280_86.mp4"}]}},{"turn": 23,"tool": "video_qa","abbrev": "VQ","thought": "Check clip 66. B. White with a progressive run, no foul.","arguments": {"video_ids": ["5588280_66"],"query": "What is the sequence of actions that takes place in this soccer clip?"},"results": {"kind": "videoqa","results": [{"clip_id": "5588280_66","answer": "B. Saka of Arsenal executed a successful lateral pass to B. White, who then accelerated with a progressive run, carrying the ball forward against Tottenham Hotspur.","is_target": false,"has_answer": false,"frame": "assets/t9_frames/clip_5588280_66.jpg","clip": "assets/t9_clips/clip_5588280_66.mp4"}]}}],"final_answer": "B. White","final_thought": "Checks each clip one by one but never puts the answers together. Returns a player name instead of a pass type.","tool_summaries": [{"abbrev": "SV","key": "search_videos","text": "Searched for Arsenal corner-kick clips across multiple games. Seven search attempts."},{"abbrev": "SD","key": "search_documents","text": "Found the match report to confirm the game with Arsenal's high corner count."},{"abbrev": "DQ","key": "document_qa","text": "Confirmed Arsenal had an unusually high first-half corner count vs Tottenham."},{"abbrev": "VQ","key": "video_qa","text": "Watched 14 clips one by one, identifying each corner delivery type.","fail": "Never combined the results across clips. Returned a player name instead of a pass type."},{"abbrev": "A","key": null,"text": "Answered 'B. White.' The question asked for a pass type, not a player."}]}};

// ── Compiled T3Panel + T9Panel + Archive components ────────────────
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// =============================================================================
// T3 + T9 cliff-panel components
// -----------------------------------------------------------------------------
// Drop-in replacements for the inner content of CliffBroadcastViewport when
// the active task is T3 (Compositional Video Retrieval) or T9 (Cross-Corpus
// Agentic Reasoning). The viewport chrome (REC dot, top label, bottom task
// strip) wraps these and is unchanged.
//
// Both components consume an `active` boolean — true while the cliff scroll
// progress is dwelling on this task's band. They use that to drive their own
// internal animation (T3 = auto-toggle between success and failure panels;
// T9 = build the trajectory strip left-to-right).
//
// Data is read from inline constants T3_PANEL and T9_PANEL emitted by
// scripts/build_panel_assets.py.
// =============================================================================

// ---------- T3 PANEL ----------

function T3Panel(_ref) {
  var pillar = _ref.pillar,
    active = _ref.active;
  var c = PILLARS[pillar];
  var panels = T3_PANEL.panels;
  // Failure-only: one panel per sport. Single-axis sport selector.
  var sports = ['basketball', 'soccer', 'hockey'];
  var _useState = useState('basketball'),
    _useState2 = _slicedToArray(_useState, 2),
    sport = _useState2[0],
    setSport = _useState2[1];
  // selectedThumbId per panel; default = top-sim (first after sort).
  var _useState3 = useState({}),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedByPanel = _useState4[0],
    setSelectedByPanel = _useState4[1];
  var bigVideoRef = useRef(null);
  useEffect(function () {
    if (!active) {
      setSport('basketball');
      setSelectedByPanel({});
    }
  }, [active]);
  var panel = panels.find(function (p) {
    return p.sport === sport;
  }) || panels[0];
  var idx = panel.id;
  // Default selected thumb = the GT clip (so the user sees the right
  // answer first, then can click HNs to compare).
  var gtThumb = panel.thumbs.find(function (t) {
    return t.is_gt;
  }) || panel.thumbs[0];
  var defaultThumbId = gtThumb.id;
  var selectedId = selectedByPanel[idx] || defaultThumbId;
  var selectedThumb = panel.thumbs.find(function (t) {
    return t.id === selectedId;
  }) || gtThumb;
  useEffect(function () {
    var el = bigVideoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play()["catch"](function () {});
  }, [idx, selectedId]);
  var pickThumb = function pickThumb(id) {
    return setSelectedByPanel(function (s) {
      return _objectSpread(_objectSpread({}, s), {}, _defineProperty({}, idx, id));
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 28,
      bottom: 32,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '11px 14px',
      gap: 8,
      background: '#0c0d10'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: 15,
      lineHeight: 1.4,
      color: '#fafafa',
      padding: '10px 14px',
      background: 'rgba(20,20,26,0.85)',
      border: '1px solid #27272a',
      borderRadius: 3,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      color: '#71717a',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginRight: 10
    }
  }, "Query"), panel.query_simple), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flex: 1,
      minHeight: 0
    }
  }, function () {
    return null;
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }
  }, function () {
    var isGT = selectedThumb.is_gt;
    var edgeColor = isGT ? '#2ECC71' : '#E74C3C';
    var edgeGlow = isGT ? 'rgba(46,204,113,0.45)' : 'rgba(231,76,60,0.45)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flex: 1,
        minHeight: 0,
        background: '#000',
        border: "2px solid ".concat(edgeColor),
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: "0 0 22px ".concat(edgeGlow)
      }
    }, /*#__PURE__*/React.createElement("video", {
      ref: bigVideoRef,
      src: selectedThumb.video,
      muted: true,
      playsInline: true,
      loop: true,
      autoPlay: true,
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        background: '#000',
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 8,
        left: 8,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: '#fafafa',
        background: 'rgba(10,10,12,0.85)',
        padding: '4px 10px',
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0,0,0,0.6)'
      }
    }, "sim ", selectedThumb.sim.toFixed(2)), isGT && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: '#0a0a0c',
        background: edgeColor,
        padding: '4px 10px',
        borderRadius: 2,
        boxShadow: "0 0 16px ".concat(edgeGlow)
      }
    }, "GT \u2713"));
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: 14,
      lineHeight: 1.45,
      color: selectedThumb.is_gt ? '#fafafa' : '#d4d4d8',
      flex: '0 0 auto',
      minHeight: 36
    }
  }, selectedThumb.diff_substring ? renderCaptionWithDiff(selectedThumb.caption, selectedThumb.diff_substring, '#ef6f5e') : selectedThumb.caption)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 116,
      flex: '0 0 116px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, panel.thumbs.map(function (th) {
    var isSelected = th.id === selectedId;
    var isGT = th.is_gt;
    var edgeColor = isGT ? '#2ECC71' : '#E74C3C'; // green / red
    var edgeGlow = isGT ? 'rgba(46,204,113,0.55)' : 'rgba(231,76,60,0.55)';
    return /*#__PURE__*/React.createElement("div", {
      key: th.id,
      onClick: function onClick() {
        return pickThumb(th.id);
      },
      style: {
        position: 'relative',
        flex: 1,
        minHeight: 0,
        background: '#000',
        border: "2px solid ".concat(edgeColor),
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isSelected ? 1 : 0.7,
        transition: 'opacity 150ms, box-shadow 150ms',
        boxShadow: isSelected ? "0 0 12px ".concat(edgeGlow) : 'none'
      }
    }, /*#__PURE__*/React.createElement("video", {
      src: th.video,
      muted: true,
      playsInline: true,
      loop: true,
      preload: "metadata",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        filter: isSelected ? 'none' : 'saturate(0.7)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 4,
        left: 5,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: '#fafafa',
        background: 'rgba(10,10,12,0.85)',
        padding: '2px 6px',
        borderRadius: 2,
        lineHeight: 1.15,
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", null, "sim ", th.sim.toFixed(2)), isGT && /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#2ECC71'
      }
    }, "\u2713")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'center',
      flex: '0 0 auto',
      marginTop: 2
    }
  }, sports.map(function (sp) {
    var isActive = sp === sport;
    return /*#__PURE__*/React.createElement("button", {
      key: sp,
      onClick: function onClick() {
        return setSport(sp);
      },
      style: {
        border: 'none',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.02em',
        padding: '9px 22px',
        borderRadius: 999,
        background: isActive ? c.base : 'rgba(28,28,31,0.85)',
        color: isActive ? '#0a0a0c' : '#e4e4e7',
        boxShadow: isActive ? "0 0 16px ".concat(c.glow) : 'inset 0 0 0 1px #3f3f46',
        transition: 'background 180ms, color 180ms, box-shadow 180ms',
        textTransform: 'capitalize'
      }
    }, sp);
  })));
}
function renderCaptionWithDiff(text, sub, color) {
  var i = text.indexOf(sub);
  if (i < 0) return text;
  return /*#__PURE__*/React.createElement(React.Fragment, null, text.slice(0, i), /*#__PURE__*/React.createElement("span", {
    style: {
      color: color,
      fontWeight: 600,
      textDecoration: 'underline',
      textDecorationStyle: 'dotted',
      textUnderlineOffset: 2
    }
  }, sub), text.slice(i + sub.length));
}

// ---------- T9 PANEL ----------

var T9_TOOL_COLOR = {
  search_documents: '#4A7FB5',
  // blue
  document_qa: '#2E9E8F',
  // teal-green
  search_videos: '#8B5CF6',
  // purple
  video_qa: '#D4913A',
  // amber
  video_qa_oracle: '#D4913A'
};

// Two-letter abbreviation used inside the per-phase chip strip.
var TOOL_ABBREV_SHORT = {
  search_documents: 'SD',
  document_qa: 'DQ',
  search_videos: 'SV',
  video_qa: 'VQ',
  video_qa_oracle: 'VQ'
};
function T9Panel(_ref2) {
  var pillar = _ref2.pillar,
    active = _ref2.active,
    data = _ref2.data,
    light = _ref2.light,
    tileColors = _ref2.tileColors,
    noClick = _ref2.noClick;
  var c = PILLARS[pillar];
  // `data` defaults to the cliff trajectory (Q45). Pass `T9_PANEL_ASK` for
  // the Ask-the-play trajectory (Q42).
  if (!data) data = T9_PANEL_CLIFF;
  // Optional per-panel color override for tiles. Falls back to T9_TOOL_COLOR.
  var toolColor = tileColors || T9_TOOL_COLOR;
  var turns = data.turns;
  var totalTiles = turns.length + 1; // + final ✗

  // Light-mode color tokens. When `light` is true (§4 "See how the models
  // answer"), the panel renders on a white card; otherwise it stays as the
  // dark broadcast monitor (cliff section).
  var bg = light ? '#ffffff' : '#0c0d10';
  var headerBg = light ? '#f4f4f5' : 'rgba(20,20,26,0.85)';
  var headerBorder = light ? '#d4d4d8' : '#27272a';
  var textPrimary = light ? '#18181b' : '#fafafa';
  var textSecondary = light ? '#52525b' : '#a1a1aa';
  var stripBg = light ? '#fafafa' : 'rgba(10,10,12,0.6)';
  var stripBorder = light ? '#e4e4e7' : '#1c1c1f';
  var tileBgIdle = light ? '#e4e4e7' : '#1c1c1f';
  var tileTextIdle = light ? '#a1a1aa' : '#3f3f46';
  var tileRevealedText = light ? '#ffffff' : '#fafafa';
  var selectedOutline = light ? '#18181b' : '#fafafa';
  var _useState5 = useState(0),
    _useState6 = _slicedToArray(_useState5, 2),
    revealedCount = _useState6[0],
    setRevealedCount = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    selectedIdx = _useState8[0],
    setSelectedIdx = _useState8[1];
  // Modal video player state: {clip_id, url} or null.
  var _useState9 = useState(null),
    _useState0 = _slicedToArray(_useState9, 2),
    modalClip = _useState0[0],
    setModalClip = _useState0[1];

  // Auto-step left-to-right when active. Reveals ~150 ms per tile.
  useEffect(function () {
    if (!active) {
      setRevealedCount(0);
      setSelectedIdx(null);
      return;
    }
    var cancelled = false;
    var n = 0;
    setRevealedCount(0);
    var _step = function step() {
      if (cancelled) return;
      n += 1;
      setRevealedCount(n);
      if (n < totalTiles) setTimeout(_step, 150);
    };
    setTimeout(_step, 250);
    return function () {
      cancelled = true;
    };
  }, [active, totalTiles]);
  var allRevealed = revealedCount >= totalTiles;

  // Tile geometry — scales down as the trajectory gets longer so the strip
  // doesn't outgrow its container. Long trajectories (Q42 non-oracle = 24
  // tiles) need thinner tiles to fit comfortably.
  var NUM_TILES_RAW = turns.length + 1;
  var TILE_W, TILE_H, TILE_GAP;
  if (NUM_TILES_RAW <= 12) {
    TILE_W = 50;
    TILE_H = 36;
    TILE_GAP = 9;
  } else if (NUM_TILES_RAW <= 16) {
    TILE_W = 44;
    TILE_H = 34;
    TILE_GAP = 7;
  } else if (NUM_TILES_RAW <= 20) {
    TILE_W = 42;
    TILE_H = 32;
    TILE_GAP = 8;
  } else {
    TILE_W = 48;
    TILE_H = 34;
    TILE_GAP = 8;
  }
  var TILE_STRIDE = TILE_W + TILE_GAP;
  var STRIP_PAD_LEFT = 8;
  var NUM_TILES = totalTiles;
  var tileCenterX = function tileCenterX(turnIdx) {
    return STRIP_PAD_LEFT + (turnIdx - 1) * TILE_STRIDE + TILE_W / 2;
  };
  var stripWidth = STRIP_PAD_LEFT * 2 + NUM_TILES * TILE_W + (NUM_TILES - 1) * TILE_GAP;
  var toggle = function toggle(i) {
    if (!allRevealed || noClick) return;
    setSelectedIdx(function (prev) {
      return prev === i ? null : i;
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 28,
      bottom: 32,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 14px',
      gap: 10,
      background: bg
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: 14,
      lineHeight: 1.45,
      color: textPrimary,
      padding: '10px 14px',
      background: headerBg,
      border: '1px solid ' + headerBorder,
      borderRadius: 3
    }
  }, !light && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: 13,
      color: textSecondary,
      lineHeight: 1.5,
      marginBottom: 8
    }
  }, "Using tools for searching through documents, asking questions about them, browsing video clips, and querying what happens in each clip, search through 33K documents and 1.76M video clips across 7,430 games to answer:"), light && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      color: '#71717a',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      marginBottom: 5
    }
  }, data.model, " \xB7 ", data.num_turns, " turns"), data.question), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '14px 6px 10px',
      background: stripBg,
      border: '1px solid ' + stripBorder,
      borderRadius: 3,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: TILE_GAP,
      alignItems: 'center',
      width: '100%'
    }
  }, turns.map(function (t, i) {
    var revealed = i < revealedCount;
    var isSelected = selectedIdx === i;
    var color = toolColor[t.tool] || '#71717a';
    return /*#__PURE__*/React.createElement("div", {
      key: t.turn,
      onClick: function onClick() {
        return toggle(i);
      },
      style: {
        flex: 1,
        minWidth: 0,
        height: TILE_H,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        background: revealed ? color : tileBgIdle,
        color: revealed ? tileRevealedText : tileTextIdle,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.02em',
        outline: isSelected ? '2px solid ' + selectedOutline : '2px solid transparent',
        outlineOffset: isSelected ? 1 : 0,
        cursor: allRevealed && !noClick ? 'pointer' : 'default',
        transition: 'background 180ms, color 180ms, outline-color 120ms',
        userSelect: 'none'
      }
    }, revealed ? t.abbrev : '');
  }), /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return toggle(turns.length);
    },
    style: {
      flex: 1,
      minWidth: 0,
      height: TILE_H,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      marginLeft: 4,
      background: revealedCount > turns.length ? '#71717a' : tileBgIdle,
      color: revealedCount > turns.length ? '#fafafa' : tileTextIdle,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 14,
      fontWeight: 700,
      outline: revealedCount > turns.length ? '2px solid #C0392B' : selectedIdx === turns.length ? '2px solid ' + selectedOutline : '2px solid transparent',
      outlineOffset: 1,
      cursor: allRevealed && !noClick ? 'pointer' : 'default',
      transition: 'background 180ms, outline-color 120ms',
      userSelect: 'none'
    }
  }, "A")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 32,
      marginTop: 6,
      width: '100%'
    }
  }, data.phases.map(function (p, pi) {
    if (revealedCount < p.start_turn) return null;
    var isLast = pi === data.phases.length - 1;
    // Percentage-based positioning (tiles are flex:1 so uniform width).
    var startIdx = p.start_turn - 1; // 0-based
    var endIdx = Math.min(p.end_turn, NUM_TILES); // inclusive, 0-based
    var leftPct = startIdx / NUM_TILES * 100 + 0.4 + '%';
    var widthPct = (endIdx - startIdx) / NUM_TILES * 100 - 0.8 + '%';
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: p.label
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: leftPct,
        width: widthPct,
        height: 2,
        background: c.base,
        opacity: 0.55,
        borderRadius: 1,
        animation: 'overlayIn 240ms ease'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: _objectSpread({
        position: 'absolute',
        top: 8,
        left: leftPct,
        width: widthPct,
        textAlign: 'center',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11.5,
        color: textSecondary,
        letterSpacing: '0.04em',
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        animation: 'overlayIn 240ms ease'
      }, isLast ? {
        textAlign: 'right'
      } : {})
    }, p.label));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      position: 'relative'
    }
  }, selectedIdx !== null ? /*#__PURE__*/React.createElement(T9HoverBubble, {
    turn: selectedIdx < turns.length ? turns[selectedIdx] : null,
    isFinal: selectedIdx === turns.length,
    data: data,
    pillarColor: c.base,
    light: light,
    onClose: function onClose() {
      return setSelectedIdx(null);
    },
    onClipClick: function onClipClick(clip_id, url) {
      return setModalClip({
        clip_id: clip_id,
        url: url
      });
    }
  }) : /*#__PURE__*/React.createElement(T9LegendAndStats, {
    data: data,
    allRevealed: allRevealed,
    light: light,
    toolColor: toolColor
  }), modalClip && /*#__PURE__*/React.createElement(T9ClipModal, {
    clip: modalClip,
    onClose: function onClose() {
      return setModalClip(null);
    }
  })));
}
function T9ClipModal(_ref3) {
  var clip = _ref3.clip,
    onClose = _ref3.onClose;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      cursor: 'pointer',
      animation: 'overlayIn 200ms ease',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      position: 'relative',
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement("video", {
    src: clip.url,
    controls: true,
    autoPlay: true,
    loop: true,
    style: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      background: '#000',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      color: '#a1a1aa',
      letterSpacing: '0.06em'
    }
  }, /*#__PURE__*/React.createElement("span", null, "clip ", clip.clip_id), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'transparent',
      border: '1px solid #3f3f46',
      color: '#e4e4e7',
      padding: '4px 12px',
      borderRadius: 3,
      fontFamily: 'inherit',
      fontSize: 11,
      cursor: 'pointer'
    }
  }, "close \u2715"))));
}
function T9LegendAndStats(_ref4) {
  var data = _ref4.data,
    allRevealed = _ref4.allRevealed,
    light = _ref4.light,
    toolColor = _ref4.toolColor;
  var tc = data.tool_counts;
  var _tc = toolColor || T9_TOOL_COLOR;
  var headerCol = light ? '#52525b' : '#a1a1aa';
  var itemActive = light ? '#18181b' : '#e4e4e7';
  var itemDim = light ? '#a1a1aa' : '#52525b';
  // Plain-English description so the user knows what each abbreviation does
  // without having to infer it from the tool name.
  var items = [{
    key: 'search_documents',
    abbrev: 'SD',
    desc: 'searches documents',
    count: tc.search_documents || 0
  }, {
    key: 'document_qa',
    abbrev: 'DQ',
    desc: 'asks questions about a document',
    count: tc.document_qa || 0
  }, {
    key: 'search_videos',
    abbrev: 'SV',
    desc: 'searches video clips',
    count: tc.search_videos || 0
  }, {
    key: 'video_qa',
    abbrev: 'VQ',
    desc: 'asks questions about a video clip',
    count: (tc.video_qa || 0) + (tc.video_qa_oracle || 0)
  }];
  // Narrative summaries: if `data.tool_summaries` exists (cliff), show
  // legend (compact horizontal) + workflow (numbered vertical) separately.
  var summaries = data.tool_summaries;
  if (summaries) {
    var legendItems = [
      { abbrev: 'SD', key: 'search_documents', label: 'search documents' },
      { abbrev: 'DQ', key: 'document_qa', label: 'ask questions about a document' },
      { abbrev: 'SV', key: 'search_videos', label: 'search video clips' },
      { abbrev: 'VQ', key: 'video_qa', label: 'ask questions about a video clip' },
      { abbrev: 'A', key: null, label: 'final answer' }
    ];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        fontFamily: '"IBM Plex Sans", sans-serif'
      }
    },
    // Legend row
    /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', flexWrap: 'wrap', gap: '4px 14px', alignItems: 'center' }
    }, legendItems.map(function (item) {
      return /*#__PURE__*/React.createElement("div", {
        key: item.abbrev,
        style: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: headerCol }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 20, height: 15, borderRadius: 2,
          background: item.key ? (_tc[item.key] || '#71717a') : '#71717a',
          color: '#fafafa', fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 8.5, fontWeight: 700
        }
      }, item.abbrev), /*#__PURE__*/React.createElement("span", {
        style: { fontFamily: '"IBM Plex Sans", sans-serif' }
      }, item.label));
    })),
    // Workflow sub-panel (boxed)
    /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(20,20,26,0.5)',
        border: '1px solid #27272a',
        borderRadius: 4,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    },
      /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11, letterSpacing: '0.12em', color: headerCol,
          textTransform: 'uppercase', fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 600, marginBottom: 2
        }
      }, 'Overall workflow'),
      summaries.map(function (s, i) {
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          style: {
            display: 'flex', alignItems: 'flex-start', gap: 8,
            fontSize: 12, lineHeight: 1.45
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 12, fontWeight: 600, color: headerCol,
            width: 16, flexShrink: 0, textAlign: 'right'
          }
        }, i + 1 + '.'), /*#__PURE__*/React.createElement("span", {
          style: { color: itemActive }
        }, s.text, s.fail && /*#__PURE__*/React.createElement("div", {
          style: { color: '#E74C3C', marginTop: 2 }
        }, s.fail)));
      })
    ),
    // "Click any tile" hint at the bottom
    allRevealed && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18, color: headerCol,
        fontFamily: '"IBM Plex Sans", sans-serif'
      }
    }, 'Click any tile to inspect.'));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: '"IBM Plex Mono", monospace'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '0.1em',
      color: headerCol,
      textTransform: 'uppercase'
    }
  }, data.num_turns, " turns \xB7 ", allRevealed ? 'click any tile to inspect' : 'tracing the agent…'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '6px 18px'
    }
  }, items.map(function (it) {
    return /*#__PURE__*/React.createElement("div", {
      key: it.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: it.count > 0 ? itemActive : itemDim
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 18,
        borderRadius: 3,
        background: _tc[it.key],
        color: '#fafafa',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.02em',
        opacity: it.count > 0 ? 1 : 0.3,
        flex: '0 0 auto'
      }
    }, it.abbrev), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: '"IBM Plex Sans", sans-serif'
      }
    }, it.desc), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#71717a',
        marginLeft: 'auto'
      }
    }, "\xD7", it.count));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      color: itemActive
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 18,
      borderRadius: 3,
      background: toolColor ? '#71717a' : '#C0392B',
      color: '#fafafa',
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 12,
      fontWeight: 700,
      flex: '0 0 auto'
    }
  }, "\u2717"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"IBM Plex Sans", sans-serif'
    }
  }, "agent gave up"))));
}
function T9CloseButton(_ref5) {
  var onClose = _ref5.onClose,
    light = _ref5.light;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: 'absolute',
      top: 6,
      right: 8,
      background: 'transparent',
      border: 'none',
      color: light ? '#52525b' : '#71717a',
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 14,
      lineHeight: 1,
      cursor: 'pointer',
      padding: 4
    }
  }, "\xD7");
}
function T9HoverBubble(_ref6) {
  var turn = _ref6.turn,
    isFinal = _ref6.isFinal,
    data = _ref6.data,
    pillarColor = _ref6.pillarColor,
    onClose = _ref6.onClose,
    onClipClick = _ref6.onClipClick,
    light = _ref6.light;
  // Light-mode color tokens. Only the OUTER bubble + its immediate text
  // flip; nested result cards (T9DocCards / T9VideoCards / etc.) keep their
  // dark "instrument readout" styling on top of the light bubble.
  var bubbleBg = light ? '#ffffff' : 'rgba(20,20,26,0.85)';
  var bubbleBorder = light ? '#d4d4d8' : '#27272a';
  var finalBg = light ? 'rgba(192,57,43,0.05)' : 'rgba(192,57,43,0.08)';
  var finalBorder = light ? 'rgba(192,57,43,0.45)' : 'rgba(192,57,43,0.5)';
  var thoughtCol = light ? '#52525b' : '#a1a1aa';
  var answerCol = light ? '#18181b' : '#e4e4e7';
  if (isFinal) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        padding: '12px 14px',
        background: finalBg,
        border: '1px solid ' + finalBorder,
        borderRadius: 3,
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontSize: 13.5,
        lineHeight: 1.45,
        animation: 'overlayIn 200ms ease'
      }
    }, /*#__PURE__*/React.createElement(T9CloseButton, {
      onClose: onClose,
      light: light
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        color: '#C0392B',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        marginBottom: 8
      }
    }, "Final answer \xB7 ", data.verdict), data.final_thought && /*#__PURE__*/React.createElement("div", {
      style: {
        color: thoughtCol,
        fontStyle: 'italic',
        marginBottom: 10,
        fontSize: 12.5,
        lineHeight: 1.4
      }
    }, "\u201C", data.final_thought, "\u201D"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: answerCol,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#C0392B',
        marginRight: 8,
        fontWeight: 600
      }
    }, "MODEL:"), data.final_answer), /*#__PURE__*/React.createElement("div", {
      style: {
        color: answerCol
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: pillarColor,
        marginRight: 8,
        fontWeight: 600
      }
    }, "GT:"), data.gt_answer));
  }
  var args = turn.arguments || {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '12px 14px',
      background: bubbleBg,
      border: '1px solid ' + bubbleBorder,
      borderRadius: 3,
      fontFamily: '"IBM Plex Sans", sans-serif',
      fontSize: 13,
      lineHeight: 1.45,
      animation: 'overlayIn 200ms ease',
      maxHeight: '100%',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(T9CloseButton, {
    onClose: onClose,
    light: light
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      color: T9_TOOL_COLOR[turn.tool],
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      marginBottom: 6
    }
  }, "Turn ", turn.turn, " \xB7 ", turn.tool.replace('_oracle', '')), turn.thought && /*#__PURE__*/React.createElement("div", {
    style: {
      color: thoughtCol,
      fontStyle: 'italic',
      marginBottom: 10,
      fontSize: 12.5,
      lineHeight: 1.4,
      borderLeft: "2px solid ".concat(T9_TOOL_COLOR[turn.tool], "66"),
      paddingLeft: 8
    }
  }, "\u201C", turn.thought, "\u201D"), turn.tool === 'search_documents' && /*#__PURE__*/React.createElement(T9SearchDocsArgs, {
    args: args,
    light: light
  }), turn.tool === 'document_qa' && /*#__PURE__*/React.createElement(T9DocQAArgs, {
    args: args,
    light: light
  }), turn.tool === 'search_videos' && /*#__PURE__*/React.createElement(T9SearchVideosArgs, {
    args: args,
    light: light
  }), (turn.tool === 'video_qa' || turn.tool === 'video_qa_oracle') && /*#__PURE__*/React.createElement(T9VideoQAArgs, {
    args: args,
    light: light
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, turn.results.kind === 'documents' && /*#__PURE__*/React.createElement(T9DocCards, {
    results: turn.results,
    light: light
  }), turn.results.kind === 'docqa' && /*#__PURE__*/React.createElement(T9DocQAResults, {
    results: turn.results,
    light: light
  }), turn.results.kind === 'videos' && /*#__PURE__*/React.createElement(T9VideoCards, {
    results: turn.results,
    onClipClick: onClipClick,
    light: light
  }), turn.results.kind === 'videoqa' && /*#__PURE__*/React.createElement(T9VideoQAResults, {
    results: turn.results,
    onClipClick: onClipClick,
    light: light
  })));
}

// ---- T9 hover sub-renderers ----

function T9KV(_ref7) {
  var k = _ref7.k,
    v = _ref7.v,
    mono = _ref7.mono,
    light = _ref7.light;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 4,
      fontSize: 12.5,
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '"IBM Plex Mono", monospace',
      color: light ? '#52525b' : '#71717a',
      minWidth: 72
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: light ? '#18181b' : '#e4e4e7',
      fontFamily: mono ? '"IBM Plex Mono", monospace' : 'inherit',
      wordBreak: 'break-word'
    }
  }, v));
}
function T9SearchDocsArgs(_ref8) {
  var args = _ref8.args,
    light = _ref8.light;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T9KV, {
    k: "query",
    v: "\"".concat(args.query || '', "\""),
    light: light
  }), args.doc_type && /*#__PURE__*/React.createElement(T9KV, {
    k: "doc_type",
    v: args.doc_type,
    mono: true,
    light: light
  }), args.teams && /*#__PURE__*/React.createElement(T9KV, {
    k: "teams",
    v: args.teams.join(', '),
    mono: true,
    light: light
  }));
}
function T9DocQAArgs(_ref9) {
  var args = _ref9.args,
    light = _ref9.light;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T9KV, {
    k: "query",
    v: "\"".concat(args.query || '', "\""),
    light: light
  }));
}
function T9SearchVideosArgs(_ref0) {
  var args = _ref0.args,
    light = _ref0.light;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T9KV, {
    k: "query",
    v: "\"".concat(args.query || '', "\""),
    light: light
  }), args.period && /*#__PURE__*/React.createElement(T9KV, {
    k: "period",
    v: args.period,
    mono: true,
    light: light
  }), args.players && /*#__PURE__*/React.createElement(T9KV, {
    k: "players",
    v: args.players.join(', '),
    mono: true,
    light: light
  }));
}
function T9VideoQAArgs(_ref1) {
  var args = _ref1.args,
    light = _ref1.light;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T9KV, {
    k: "query",
    v: "\"".concat(args.query || '', "\""),
    light: light
  }));
}
function T9DocIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: 11,
    height: 13,
    viewBox: "0 0 11 13",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0.5,
    y: 0.5,
    width: 10,
    height: 12,
    rx: 1,
    fill: "none",
    stroke: "#71717a",
    strokeWidth: 1
  }), /*#__PURE__*/React.createElement("line", {
    x1: 2.5,
    y1: 4,
    x2: 8.5,
    y2: 4,
    stroke: "#71717a",
    strokeWidth: 0.8
  }), /*#__PURE__*/React.createElement("line", {
    x1: 2.5,
    y1: 6.5,
    x2: 8.5,
    y2: 6.5,
    stroke: "#71717a",
    strokeWidth: 0.8
  }), /*#__PURE__*/React.createElement("line", {
    x1: 2.5,
    y1: 9,
    x2: 6.5,
    y2: 9,
    stroke: "#71717a",
    strokeWidth: 0.8
  }));
}
function T9TargetSummary(_ref10) {
  var results = _ref10.results,
    displayedN = _ref10.displayedN,
    kind = _ref10.kind;
  var noun = kind === 'docs' ? 'documents' : 'clips';
  var tr = results.target_ranks || [];
  var relevantLine;
  if (tr.length === 0) {
    relevantLine = "No relevant ".concat(kind === 'docs' ? 'document' : 'clip', " found");
  } else if (tr.length === 1) {
    relevantLine = "Found relevant ".concat(kind === 'docs' ? 'document' : 'clip', " at rank ", tr[0]);
  } else {
    relevantLine = "Found ".concat(tr.length, " relevant ", noun, " at rank ", tr.join(', '));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex', flexDirection: 'column', gap: 2,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  },
  /*#__PURE__*/React.createElement("div", {
    style: { color: '#a1a1aa' }
  }, results.total, " ", noun, " found"),
  /*#__PURE__*/React.createElement("div", {
    style: { color: tr.length > 0 ? '#2E9E8F' : '#71717a' }
  }, relevantLine));
}
function T9DocCards(_ref11) {
  var results = _ref11.results,
    light = _ref11.light;
  var cardBg = light ? '#f4f4f5' : 'rgba(28,28,31,0.6)';
  var cardBorder = light ? '#d4d4d8' : '#27272a';
  var idCol = light ? '#18181b' : '#e4e4e7';
  var teamsCol = light ? '#52525b' : '#a1a1aa';
  var highlightCol = light ? '#3f3f46' : '#d4d4d8';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(T9TargetSummary, {
    results: results,
    displayedN: results.top.length,
    kind: "docs"
  }), results.top.map(function (d) {
    return /*#__PURE__*/React.createElement("div", {
      key: d.rank,
      style: {
        display: 'flex',
        gap: 8,
        padding: '7px 9px',
        background: cardBg,
        border: "1px solid ".concat(d.is_target ? '#2E9E8F' : cardBorder),
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement(T9DocIcon, null), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11.5,
        color: d.is_target ? '#2E9E8F' : idCol
      }
    }, /*#__PURE__*/React.createElement("span", null, "#", d.rank, d.is_target ? ' · relevant ✓' : '', "  \xB7  ", d.doc_id)), d.teams && d.teams.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        color: teamsCol,
        marginTop: 2
      }
    }, d.teams.join(' · ')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: highlightCol,
        marginTop: 4,
        lineHeight: 1.4,
        fontStyle: 'italic',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }
    }, d.highlight)));
  }), results.total > results.top.length && /*#__PURE__*/React.createElement("div", {
    style: { fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: '#52525b', textAlign: 'right' }
  }, "Top ", results.top.length, " results shown"));
}
function T9DocQAResults(_ref12) {
  var results = _ref12.results,
    light = _ref12.light;
  var cardBg = light ? '#f4f4f5' : 'rgba(28,28,31,0.6)';
  var cardBorder = light ? '#d4d4d8' : '#27272a';
  var idDimCol = light ? '#52525b' : '#a1a1aa';
  var answerCol = light ? '#18181b' : '#e4e4e7';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex', flexDirection: 'column', gap: 2,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 9.5,
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  },
  /*#__PURE__*/React.createElement("div", { style: { color: '#a1a1aa' } },
    results.results.length, " document", results.results.length === 1 ? '' : 's', " analyzed"),
  /*#__PURE__*/React.createElement("div", { style: { color: results.results.some(function(r) { return r.contains_answer; }) ? '#2E9E8F' : '#71717a' } },
    results.results.some(function(r) { return r.contains_answer; }) ? 'Found relevant document' : 'No relevant document found')),
  results.results.slice(0, 2).map(function (r, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 8,
        padding: '6px 8px',
        background: cardBg,
        border: "1px solid ".concat(r.contains_answer ? '#2E9E8F' : cardBorder),
        borderRadius: 2
      }
    }, /*#__PURE__*/React.createElement(T9DocIcon, null), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 10,
        color: r.contains_answer ? '#2E9E8F' : idDimCol,
        marginBottom: 3
      }
    }, r.doc_id, " ", r.contains_answer ? ' · ✓ contains answer' : ''), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: answerCol,
        lineHeight: 1.35,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, r.answer)));
  }), results.results.length > 2 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 10,
      color: '#52525b',
      textAlign: 'right'
    }
  }, "Top 2 results shown"));
}
function T9VideoIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: 13,
    height: 13,
    viewBox: "0 0 13 13",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: 0.5,
    y: 1.5,
    width: 12,
    height: 10,
    rx: 1,
    fill: "none",
    stroke: "#71717a",
    strokeWidth: 1
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "5,4.5 5,8.5 8.5,6.5",
    fill: "#71717a"
  }));
}
function T9VideoCards(_ref13) {
  var results = _ref13.results,
    onClipClick = _ref13.onClipClick,
    light = _ref13.light;
  var labelDim = light ? '#52525b' : '#a1a1aa';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(T9TargetSummary, {
    results: results,
    displayedN: results.top.length,
    kind: "clips"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, results.top.map(function (v) {
    var hasClip = !!v.clip;
    return /*#__PURE__*/React.createElement("div", {
      key: v.rank,
      onClick: function onClick() {
        return hasClip && onClipClick && onClipClick(v.clip_id, v.clip);
      },
      style: {
        flex: 1,
        minWidth: 0,
        border: "1px solid ".concat(v.is_target ? '#D4913A' : '#27272a'),
        borderRadius: 3,
        overflow: 'hidden',
        background: '#000',
        cursor: hasClip ? 'pointer' : 'default',
        transition: 'transform 150ms, border-color 150ms'
      },
      onMouseEnter: function onMouseEnter(e) {
        return hasClip && (e.currentTarget.style.transform = 'scale(1.02)');
      },
      onMouseLeave: function onMouseLeave(e) {
        return hasClip && (e.currentTarget.style.transform = 'scale(1)');
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        background: '#000'
      }
    }, v.frame ? /*#__PURE__*/React.createElement("img", {
      src: v.frame,
      alt: "clip ".concat(v.clip_id),
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3f3f46'
      }
    }, /*#__PURE__*/React.createElement(T9VideoIcon, null)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 4,
        left: 5,
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: v.is_target ? '#0a0a0c' : '#fafafa',
        background: v.is_target ? '#D4913A' : 'rgba(10,10,12,0.85)',
        padding: '2px 6px',
        borderRadius: 2,
        lineHeight: 1.15
      }
    }, "#".concat(v.rank).concat(v.is_target ? ' relevant' : '')), hasClip && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 12 12"
    }, /*#__PURE__*/React.createElement("polygon", {
      points: "3,2 3,10 10,6",
      fill: "#fafafa"
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '5px 7px',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        color: v.is_target ? '#D4913A' : labelDim,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, v.clip_id));
  }), results.total > results.top.length && /*#__PURE__*/React.createElement("div", {
    style: { fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: '#52525b', textAlign: 'right' }
  }, "Top ", results.top.length, " results shown")));
}
function T9VideoQAResults(_ref14) {
  var results = _ref14.results,
    onClipClick = _ref14.onClipClick,
    light = _ref14.light;
  var items = results.results;
  var targetCount = items.filter(function (r) {
    return r.is_target;
  }).length;
  var cardBg = light ? '#f4f4f5' : 'rgba(28,28,31,0.6)';
  var cardBorder = light ? '#d4d4d8' : '#27272a';
  var cardBorderDim = light ? '#e4e4e7' : '#1c1c1f';
  var idDimCol = light ? '#52525b' : '#a1a1aa';
  var answerCol = light ? '#18181b' : '#e4e4e7';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex', flexDirection: 'column', gap: 2,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  },
  /*#__PURE__*/React.createElement("div", { style: { color: '#a1a1aa' } },
    items.length, " clip", items.length === 1 ? '' : 's', " analyzed"),
  /*#__PURE__*/React.createElement("div", { style: { color: targetCount > 0 ? '#2E9E8F' : '#71717a' } },
    targetCount > 0 ? "Found ".concat(targetCount, " relevant clip").concat(targetCount === 1 ? '' : 's') : 'No relevant clips found')),
  items.slice(0, 3).map(function (r, i) {
    var hasClip = !!r.clip;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 10,
        padding: '8px 10px',
        background: cardBg,
        border: "1px solid ".concat(r.is_target ? '#D4913A' : r.has_answer ? cardBorder : cardBorderDim),
        borderRadius: 3
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: function onClick() {
        return hasClip && onClipClick && onClipClick(r.clip_id, r.clip);
      },
      style: {
        position: 'relative',
        width: 96,
        height: 54,
        flex: '0 0 auto',
        borderRadius: 2,
        background: '#000',
        overflow: 'hidden',
        cursor: hasClip ? 'pointer' : 'default',
        opacity: r.has_answer ? 1 : 0.55
      }
    }, r.frame ? /*#__PURE__*/React.createElement("img", {
      src: r.frame,
      alt: r.clip_id,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3f3f46'
      }
    }, /*#__PURE__*/React.createElement(T9VideoIcon, null)), hasClip && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "11",
      height: "11",
      viewBox: "0 0 12 12"
    }, /*#__PURE__*/React.createElement("polygon", {
      points: "3,2 3,10 10,6",
      fill: "#fafafa"
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 11,
        color: r.is_target ? '#D4913A' : idDimCol,
        marginBottom: 3
      }
    }, r.clip_id, r.is_target ? ' · relevant ✓' : ''), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: answerCol,
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, r.answer)));
  }), items.length > 3 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 10,
      color: '#52525b',
      textAlign: 'right'
    }
  }, "Top 3 results shown"));
}
