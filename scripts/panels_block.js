// ── Plain JS globals (shared with the Babel block) ──────────────────
const { useEffect, useRef, useState } = React;

const PILLARS = {
  Perception: { base: '#4A7FB5', glow: 'rgba(74,127,181,0.55)', soft: 'rgba(74,127,181,0.12)' },
  Reasoning:  { base: '#2E9E8F', glow: 'rgba(46,158,143,0.55)', soft: 'rgba(46,158,143,0.12)' },
  Simulation: { base: '#D4913A', glow: 'rgba(212,145,58,0.55)', soft: 'rgba(212,145,58,0.12)' },
  Agency:     { base: '#C0392B', glow: 'rgba(192,57,43,0.55)',  soft: 'rgba(192,57,43,0.12)' },
};

const T3_PANEL = {"panels": [{"id": "basketball", "sport": "basketball", "query_simple": "Find the clip where a guard misses a contested two-point jumper after a catch-and-drive at the low post.", "query_full": "The basketball player performs 2 pt missed with a shot from low post with a jumper during catch and drive with a shot using right hand with a shot while contested.", "composition": {"action_name": "2-", "playtype": "Catch and Drive", "hand": "Right", "shot_type": "Jumper", "contesting": "Contested", "cur_pos": "Low Post"}, "thumbs": [{"id": "neg1", "is_gt": false, "sim": 0.84, "video": "assets/t3_videos/basketball/neg1.mp4", "caption": "On a post-up at the low post, a guard misses a contested two-point jumper.", "diff_substring": "post-up", "diff_axis": "playtype", "diff_values": {"positive": "Catch and Drive", "negative": "Post"}}, {"id": "neg2", "is_gt": false, "sim": 0.79, "video": "assets/t3_videos/basketball/neg2.mp4", "caption": "On a catch and drive from the low post, the guard puts up an uncontested jumper and misses the two point shot.", "diff_substring": "uncontested", "diff_axis": "contesting", "diff_values": {"positive": "Contested", "negative": "Uncontested"}}, {"id": "neg3", "is_gt": false, "sim": 0.74, "video": "assets/t3_videos/basketball/neg3.mp4", "caption": "A guard catches and drives from the low post, then makes a contested two-point jumper.", "diff_substring": "makes", "diff_axis": "action_name", "diff_values": {"positive": "2-", "negative": "2+"}}, {"id": "gt", "is_gt": true, "sim": 0.62, "video": "assets/t3_videos/basketball/gt.mp4", "caption": "After a catch-and-drive at the low post, a guard misses a contested two-point jumper.", "diff_substring": null, "diff_axis": null}]}, {"id": "soccer", "sport": "soccer", "query_simple": "Find the clip of a defender making a lateral pass down the right wing.", "query_full": "A soccer player in defender position performs pass successful with lateral pass attacking from the right side.", "composition": {"position": "defender", "primary_action": "pass+", "secondary_action": "lateral_pass", "flank": "right"}, "thumbs": [{"id": "neg1", "is_gt": false, "sim": 0.83, "video": "assets/t3_videos/soccer/neg1.mp4", "caption": "A defender plays a lateral pass through the center.", "diff_substring": "through the center", "diff_axis": "flank", "diff_values": {"positive": "right", "negative": "center"}}, {"id": "neg2", "is_gt": false, "sim": 0.78, "video": "assets/t3_videos/soccer/neg2.mp4", "caption": "A midfielder plays a lateral pass down the right flank.", "diff_substring": "midfielder", "diff_axis": "position", "diff_values": {"positive": "defender", "negative": "midfield"}}, {"id": "neg3", "is_gt": false, "sim": 0.73, "video": "assets/t3_videos/soccer/neg3.mp4", "caption": "A defender's lateral pass down the right flank is intercepted.", "diff_substring": "is intercepted", "diff_axis": "primary_action", "diff_values": {"positive": "pass+", "negative": "pass-"}}, {"id": "gt", "is_gt": true, "sim": 0.63, "video": "assets/t3_videos/soccer/gt.mp4", "caption": "A defender plays a lateral pass down the right flank.", "diff_substring": null, "diff_axis": null}]}, {"id": "hockey", "sport": "hockey", "query_simple": "Find the clip where a defender blocks a wrist shot in the offensive zone with the goalie in butterfly.", "query_full": "The hockey player performs blocked shot in the offensive zone with a wrist shot with a goalie having clean view shot view with a goalie having in the butterfly position stance.", "composition": {"action_name": "Blocked shot", "shot_type": "Wrist shot", "goalie_view": "Clean view shot", "goalie_stance": "In the butterfly position", "zone_name": "OZ"}, "thumbs": [{"id": "neg1", "is_gt": false, "sim": 0.82, "video": "assets/t3_videos/hockey/neg1.mp4", "caption": "In the offensive zone, a defender blocks a slapshot with the goalie in the butterfly position.", "diff_substring": "slapshot", "diff_axis": "shot_type", "diff_values": {"positive": "Wrist shot", "negative": "Slapshot"}}, {"id": "neg2", "is_gt": false, "sim": 0.77, "video": "assets/t3_videos/hockey/neg2.mp4", "caption": "A skater scores a goal in the offensive zone on a wrist shot while the goalie sits in butterfly.", "diff_substring": "scores a goal", "diff_axis": "action_name", "diff_values": {"positive": "Blocked shot", "negative": "Goal"}}, {"id": "neg3", "is_gt": false, "sim": 0.73, "video": "assets/t3_videos/hockey/neg3.mp4", "caption": "A defender blocks a wrist shot in the offensive zone while the goalie holds a split position.", "diff_substring": "split position", "diff_axis": "goalie_stance", "diff_values": {"positive": "In the butterfly position", "negative": "Split position"}}, {"id": "gt", "is_gt": true, "sim": 0.6, "video": "assets/t3_videos/hockey/gt.mp4", "caption": "A defender blocks a wrist shot in the offensive zone where the goalie is set in the butterfly.", "diff_substring": null, "diff_axis": null}]}]};
const T9_PANEL_CLIFF = {"question_id": 45, "question": "In New Orleans' wire-to-wire win with 14 first-half threes, how many more points were the Clippers down after Batum's Q3 four-point play than after Westbrook's Q2 three-point play?", "category": "Two-Moment Score Math (3-point play vs 4-point play)", "game_id": "1006435", "gt_answer": "5", "verdict": "Wrong", "model": "GPT-5.2", "mode": "oracle", "num_turns": 8, "tool_counts": {"search_documents": 2, "document_qa": 2, "search_videos": 1, "video_qa_oracle": 3}, "tool_summaries": [{"abbrev": "SD", "key": "search_documents", "text": "Searched game reports. Found the Pelicans vs Clippers game on the second try."}, {"abbrev": "DQ", "key": "document_qa", "text": "Asked the report for score deficits. The report described the plays but didn't quote exact scores."}, {"abbrev": "SV", "key": "search_videos", "text": "Pivoted to video. Found clips of both Westbrook's and Batum's plays."}, {"abbrev": "VQ", "key": "video_qa_oracle", "text": "Asked 3 clips for the score. Got Westbrook's deficit (Clippers 48, Pelicans 56) but never asked Batum's clip the same question."}, {"abbrev": "\u2717", "key": null, "text": "Refused to answer. Had one side of the comparison but not the other."}], "phases": [{"start_turn": 1, "end_turn": 4, "label": "Find the game"}, {"start_turn": 5, "end_turn": 5, "label": "Pivot to video"}, {"start_turn": 6, "end_turn": 8, "label": "Probe clips"}, {"start_turn": 9, "end_turn": 9, "label": "Give up"}], "turns": [{"turn": 1, "tool": "search_documents", "abbrev": "SD", "thought": "Find the game \u2014 New Orleans wire-to-wire, 14 threes by halftime.", "arguments": {"query": "New Orleans led wire-to-wire 14 threes by halftime Westbrook three-point play Batum four-point play", "doc_type": "espn_report"}, "results": {"kind": "documents", "total": 20, "target_count": 0, "target_ranks": [], "top": [{"rank": 1, "doc_id": "176266_espn_report", "teams": ["Charlotte Hornets", "Brooklyn Nets"], "highlight": "Allen led the Nets with 11 points in the third.. \nThe Nets took a 56-51 lead into the locker room at the half as Prince andDeAndre Jordanled all score...", "is_target": false}, {"rank": 2, "doc_id": "867981_espn_report", "teams": ["Indiana Pacers", "Cleveland Cavaliers"], "highlight": "\u201cWe can rely on him when it comes down to the wire or on a bucket or an assist.\u201d. \n", "is_target": false}, {"rank": 3, "doc_id": "406781_espn_report", "teams": ["Oklahoma City Thunder", "Denver Nuggets"], "highlight": "Denver led 56-52 at halftime behind 13 points from Murray and 12 points and 12 rebounds by Jokic.. \nOklahoma City'sJerami Granthit a 3-pointer to tie ...", "is_target": false}]}}, {"turn": 2, "tool": "search_documents", "abbrev": "SD", "thought": "First search missed it. Try again with both team names.", "arguments": {"query": "Clippers Pelicans led wire-to-wire 14 threes by halftime Westbrook three-point play Batum four-point play", "doc_type": "espn_report"}, "results": {"kind": "documents", "total": 20, "target_count": 1, "target_ranks": [1], "top": [{"rank": 1, "doc_id": "1006435_espn_report", "teams": ["New Orleans Pelicans", "Los Angeles Clippers"], "highlight": "Clippers: FNicolas Batumprovided some offensive pop off the bench, finishing with 13 points, including a four-point play in the third quarter. \n... Mc...", "is_target": true}, {"rank": 2, "doc_id": "780877_espn_report", "teams": ["New Orleans Pelicans", "Detroit Pistons"], "highlight": "The Pelicans' lead ballooned to 18 points later in the period when Alexander-Walker made a 3 and layup in succession.. \nTIP-INS. \n", "is_target": false}, {"rank": 3, "doc_id": "867981_espn_report", "teams": ["Indiana Pacers", "Cleveland Cavaliers"], "highlight": "\u201cWe can rely on him when it comes down to the wire or on a bucket or an assist.\u201d. \n", "is_target": false}]}}, {"turn": 3, "tool": "document_qa", "abbrev": "DQ", "thought": "Got the game report. Ask it for both deficits in one go.", "arguments": {"doc_ids": ["1006435_espn_report"], "query": "In this report, by how many points were the Clippers trailing immediately after Russell Westbrook completed his three-point play in the second quarter, and by how many points were they trailing immediately after Nicolas Batum completed his four-point play in the third quarter? Provide the two deficits."}, "results": {"kind": "docqa", "results": [{"doc_id": "1006435_espn_report", "answer": "Let me carefully analyze the document to find information about the Clippers' trailing points after specific plays.\n\nFirst, let's look for the relevant information about Russell Westbrook's three-point play in the sec\u2026", "is_target": true, "contains_answer": true}]}}, {"turn": 4, "tool": "document_qa", "abbrev": "DQ", "thought": "Report doesn't quote the scores. Ask it again, even more directly.", "arguments": {"doc_ids": ["1006435_espn_report"], "query": "Quote the lines that mention: (1) Russell Westbrook completing a three-point play in the second quarter and state the score or how many points the Clippers trailed immediately after it; (2) Nicolas Batum completing a four-point play in the third quarter and state the score or how many points the Clippers trailed immediately after it. Provide the two deficits as numbers."}, "results": {"kind": "docqa", "results": [{"doc_id": "1006435_espn_report", "answer": "Let me carefully read through the document to find the information I need for the two parts of the question.\n\nFirst, I need to find:\n1) Russell Westbrook completing a three-point play in the second quarter and the sco\u2026", "is_target": true, "contains_answer": false}]}}, {"turn": 5, "tool": "search_videos", "abbrev": "SV", "thought": "Reports are a dead end. Search clips around Westbrook and Batum.", "arguments": {"query": "three-point play and-one four-point play", "game_ids": ["1006435"], "players": ["Russell Westbrook", "Nicolas Batum"]}, "results": {"kind": "videos", "total": 74, "target_count": 4, "target_ranks": [5, 39, 68, 74], "top": [{"rank": 1, "clip_id": "1006435_60", "quarter": 2, "is_target": false, "frame": "assets/t9_frames/clip_1006435_60.jpg", "clip": "assets/t9_clips/clip_1006435_60.mp4"}, {"rank": 2, "clip_id": "1006435_78", "quarter": 2, "is_target": false, "frame": "assets/t9_frames/clip_1006435_78.jpg", "clip": "assets/t9_clips/clip_1006435_78.mp4"}, {"rank": 3, "clip_id": "1006435_5", "quarter": 1, "is_target": false, "frame": "assets/t9_frames/clip_1006435_5.jpg", "clip": "assets/t9_clips/clip_1006435_5.mp4"}]}}, {"turn": 6, "tool": "video_qa_oracle", "abbrev": "VQ", "thought": "Ask four clips what happened. Clip 188 (target) shows Batum's 3+1 \u2014 but only the action, not the score.", "arguments": {"video_ids": ["1006435_177", "1006435_178", "1006435_188", "1006435_189"], "query": "What is the sequence of actions that takes place in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1006435_177", "answer": "Josh Richardson misses a 3-point jumper from the corner (catch and shoot, right hand, contested by Nicolas Batum). Larry Nance Jr. secures the rebound. Larry Nance Jr. then misses a 2-point layup in the restricted are\u2026", "is_target": false, "has_answer": true, "clip": "assets/t9_clips/clip_1006435_177.mp4"}, {"clip_id": "1006435_178", "answer": "Let me analyze the provided event logs/captions to determine the sequence of actions that takes place in this video clip.\n\nFrom the caption:\n\"Nicolas Batum performed 3 Pt Missed from Corner with a Jumper during a Catc\u2026", "is_target": false, "has_answer": false, "clip": "assets/t9_clips/clip_1006435_178.mp4"}, {"clip_id": "1006435_188", "answer": "We are given a clip of events/captions for a video clip and need to answer the question about the sequence of actions.\n\nThe event log/captions provided:\n\"Trey Murphy III performed Error leading to goal. Nicolas Batum\u2026", "is_target": true, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_188.jpg", "clip": "assets/t9_clips/clip_1006435_188.mp4"}, {"clip_id": "1006435_189", "answer": "Nicolas Batum made a free throw, resulting in the score update to Los Angeles Clippers 85 - 97 New Orleans Pelicans.", "is_target": true, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_189.jpg"}]}}, {"turn": 7, "tool": "video_qa_oracle", "abbrev": "VQ", "thought": "Probe eleven more clips for Westbrook's play sequence. Still asking 'what happened?', not 'what's the score?'", "arguments": {"video_ids": ["1006435_78", "1006435_87", "1006435_92", "1006435_93", "1006435_98", "1006435_101", "1006435_106", "1006435_110", "1006435_112", "1006435_116", "1006435_118"], "query": "What is the sequence of actions that takes place in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1006435_78", "answer": "Russell Westbrook passes the ball to Eric Gordon. Eric Gordon catches the ball and immediately shoots a three-point jumper with his right hand from the point guard position, while being contested by CJ McCollum; the s\u2026", "is_target": false, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_78.jpg", "clip": "assets/t9_clips/clip_1006435_78.mp4"}, {"clip_id": "1006435_87", "answer": "Russell Westbrook attempts a 3-point jumper from the corner during a catch and shoot, shoots with his right hand while uncontested, misses the shot, and Naji Marshall secures the rebound.", "is_target": false, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_87.jpg", "clip": "assets/t9_clips/clip_1006435_87.mp4"}, {"clip_id": "1006435_92", "answer": "CJ McCollum attempts a 3-point jump shot using a step-back during a catch and drive with his right hand, contested by Nicolas Batum, resulting in a miss. Russell Westbrook then secures the rebound.", "is_target": false, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_92.jpg", "clip": "assets/t9_clips/clip_1006435_92.mp4"}, {"clip_id": "1006435_93", "answer": "Russell Westbrook attempts a 2-point jumper from the restricted area using a spin move during a pick-and-roll play with his right hand, while being contested by CJ McCollum. His shot misses, and CJ McCollum then secur\u2026", "is_target": false, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_93.jpg"}, {"clip_id": "1006435_98", "answer": "1. Kawhi Leonard assisted Russell Westbrook. 2. Brandon Ingram made an error leading to a goal. 3. Brandon Ingram committed a foul. 4. Russell Westbrook scored an and-one layup from the restricted area during a pick-a\u2026", "is_target": true, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_98.jpg", "clip": "assets/t9_clips/clip_1006435_98.mp4"}, {"clip_id": "1006435_101", "answer": "The sequence of actions in this video clip consists of Russell Westbrook committing a turnover.", "is_target": false, "has_answer": true}, {"clip_id": "1006435_106", "answer": "Let me analyze the provided event logs/captions to understand what happened in this video clip.\n\nThe event logs/captions state:\n1. \"Russell Westbrook assisted by Nicolas Batum.\"\n2. \"Naji Marshall performed Error leadi\u2026", "is_target": false, "has_answer": true}, {"clip_id": "1006435_110", "answer": "1. Naji Marshall misses a 3-point shot from the corner with a right-handed jumper during an uncontested catch-and-shoot (guarded by Marcus Morris). 2. Russell Westbrook rebounds the ball. 3. Naji Marshall commits a foul.", "is_target": false, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_110.jpg"}, {"clip_id": "1006435_112", "answer": "Naji Marshall committed a technical foul first, followed by Russell Westbrook making a free throw for the Los Angeles Clippers. The technical foul resulted in the Clippers gaining possession of the ball and Westbrook\u2026", "is_target": false, "has_answer": true}, {"clip_id": "1006435_116", "answer": "The sequence of actions in this video clip begins with Kawhi Leonard executing a catch and shoot 3-point jumper from the wing using his right hand while being contested by Brandon Ingram. The shot is missed, and immed\u2026", "is_target": false, "has_answer": true}, {"clip_id": "1006435_118", "answer": "Russell Westbrook attempts a 3-point jumper from the corner during a catch-and-shoot play with his right hand while being contested by CJ McCollum, resulting in a missed shot. Larry Nance Jr. secures the rebound.", "is_target": false, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_118.jpg"}]}}, {"turn": 8, "tool": "video_qa_oracle", "abbrev": "VQ", "thought": "Finally ask one target clip for the score. Get back 'Clippers 48 \u2013 56 Pelicans.'", "arguments": {"video_ids": ["1006435_98"], "query": "What is the current score of the game?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1006435_98", "answer": "Los Angeles Clippers 48 - 56 New Orleans Pelicans", "is_target": true, "has_answer": true, "frame": "assets/t9_frames/clip_1006435_98.jpg", "clip": "assets/t9_clips/clip_1006435_98.mp4"}]}}], "final_answer": "I cannot find the answer in the provided documents or videos.", "final_thought": "Have Westbrook's deficit (Clippers down 8). For Batum's play, only the action description \u2014 no score state. Refuse without both."};
const T9_PANEL_ASK = {"question_id": 42, "question": "In the game where Devin Booker hit six threes and Phoenix finished with 20 made threes, find the early third-quarter shot that trimmed Chicago's lead from four down to one. What jersey number was the scorer wearing?", "model": "GPT-5.2", "mode": "non-oracle", "gt_answer": "1", "verdict": "Wrong", "num_turns": 23, "tool_counts": {"search_documents": 1, "document_qa": 1, "search_videos": 6, "video_qa": 15}, "phases": [{"start_turn": 1, "end_turn": 2, "label": "Find the game"}, {"start_turn": 3, "end_turn": 6, "label": "First video pass"}, {"start_turn": 7, "end_turn": 11, "label": "Refine, ask more clips"}, {"start_turn": 12, "end_turn": 18, "label": "Drill harder"}, {"start_turn": 19, "end_turn": 23, "label": "Final attempts"}, {"start_turn": 24, "end_turn": 24, "label": "Guess: 5"}], "turns": [{"turn": 1, "tool": "search_documents", "abbrev": "SD", "thought": "Find the Suns\u2013Bulls game where Booker had six threes and Phoenix made twenty.", "arguments": {"query": "Devin Booker six threes Phoenix 20 made threes Chicago early third quarter trimmed lead from four to one", "doc_type": "espn_report"}, "results": {"kind": "documents", "total": 0, "target_count": 0, "target_ranks": [], "top": [{"rank": null, "doc_id": "732051_espn_report", "teams": ["Phoenix Suns", "Cleveland Cavaliers"], "highlight": "Devin Bookerscored 31 points, Paul added 23 and 16 assists and Phoenix scored the first 15 points of OT to outlast the under-mannedCleveland Cavaliers134-118 for their fifth strai\u2026", "is_target": false}, {"rank": null, "doc_id": "1003418_espn_report", "teams": ["Phoenix Suns", "Chicago Bulls"], "highlight": "And they're off to a good start with their shiny new star.. \nDevin Bookerscored 35 points and matched his career high with six 3s, Durant added 20 points in his second game with P\u2026", "is_target": false}, {"rank": null, "doc_id": "791802_espn_report", "teams": ["Phoenix Suns", "Los Angeles Clippers"], "highlight": "Booker scored 12 points \u2014 mostly on mid-range jumpers \u2014 in the final 3:09 of the third to get Phoenix back on track. \n... PHOENIX -- \u2014Devin Booker's first exposure to playoff bask\u2026", "is_target": false}]}}, {"turn": 2, "tool": "document_qa", "abbrev": "DQ", "thought": "Ask the matched reports to confirm both stats.", "arguments": {"doc_ids": ["1003418_espn_report"], "query": "In this game report, what early third-quarter shot trimmed Chicago's lead from four points down to one, and who made the shot?"}, "results": {"kind": "docqa", "results": [{"doc_id": "1003418_espn_report", "answer": "Kevin Durant scored seven straight points early in the third quarter to trim Chicago's lead from four points down to one, putting the Suns back on top 70-67.", "is_target": false, "contains_answer": false}]}}, {"turn": 3, "tool": "search_videos", "abbrev": "SV", "thought": "Pivot to video. Search the early-Q3 window in the right game.", "arguments": {"query": "Durant early third quarter shot cuts lead to one", "game_ids": ["1003418"], "quarter": 3, "players": ["Kevin Durant"]}, "results": {"kind": "videos", "total": 0, "target_count": 0, "target_ranks": [], "top": [{"rank": null, "clip_id": "1003418_144", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_144.jpg", "clip": "assets/t9_clips/clip_1003418_144.mp4"}, {"rank": null, "clip_id": "1003418_142", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_142.jpg", "clip": "assets/t9_clips/clip_1003418_142.mp4"}, {"rank": null, "clip_id": "1003418_145", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_145.jpg", "clip": "assets/t9_clips/clip_1003418_145.mp4"}]}}, {"turn": 4, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask the first returned clip what jersey number the scorer wore.", "arguments": {"video_ids": ["1003418_141"], "query": "What is the current score of the game shown in the broadcast during this clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_141", "answer": "67 - 65 in favor of the Phoenix Suns as they face the Chicago Bulls.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_141.jpg", "clip": "assets/t9_clips/clip_1003418_141.mp4"}]}}, {"turn": 5, "tool": "video_qa", "abbrev": "VQ", "thought": "Try another clip.", "arguments": {"video_ids": ["1003418_142"], "query": "What is the current score of the game shown in the broadcast during this clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_142", "answer": "67 - 65", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_142.jpg", "clip": "assets/t9_clips/clip_1003418_142.mp4"}]}}, {"turn": 6, "tool": "video_qa", "abbrev": "VQ", "thought": "And another. Still no jersey number.", "arguments": {"video_ids": ["1003418_144"], "query": "What is the current score of the game shown in the broadcast during this clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_144", "answer": "67 - 65", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_144.jpg", "clip": "assets/t9_clips/clip_1003418_144.mp4"}]}}, {"turn": 7, "tool": "search_videos", "abbrev": "SV", "thought": "Refine the video search with a tighter temporal-boundary filter.", "arguments": {"query": "", "game_ids": ["1003418"], "quarter": 3, "temporal_boundary": "0-120"}, "results": {"kind": "videos", "total": 0, "target_count": 0, "target_ranks": [], "top": [{"rank": null, "clip_id": "1003418_138", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_138.jpg", "clip": "assets/t9_clips/clip_1003418_138.mp4"}, {"rank": null, "clip_id": "1003418_139", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_139.jpg", "clip": "assets/t9_clips/clip_1003418_139.mp4"}, {"rank": null, "clip_id": "1003418_140", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_140.jpg", "clip": "assets/t9_clips/clip_1003418_140.mp4"}]}}, {"turn": 8, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask the new batch the same question.", "arguments": {"video_ids": ["1003418_138"], "query": "What is the current score of the game shown in the broadcast during this clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_138", "answer": "Cameron Payne, wearing #15 for the Phoenix Suns, secured a rebound before executing a Pick 'n' Roll. He attempted a right-handed jumper from the point but missed the 3-point shot, contested by Derrick Jones Jr., who is\u2026", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_138.jpg", "clip": "assets/t9_clips/clip_1003418_138.mp4"}]}}, {"turn": 9, "tool": "video_qa", "abbrev": "VQ", "thought": "Repeat \u2014 still asking.", "arguments": {"video_ids": ["1003418_141"], "query": "What is the sequence of actions that takes place in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_141", "answer": "Jevon Carter (#5) assisted Cameron Payne (#15), who made a 3-point jumper from the wing with a right-handed catch and shoot despite being contested by Alex Caruso (#6). The teams are the Chicago Bulls and Phoenix Suns,\u2026", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_141.jpg", "clip": "assets/t9_clips/clip_1003418_141.mp4"}]}}, {"turn": 10, "tool": "video_qa", "abbrev": "VQ", "thought": "Repeat.", "arguments": {"video_ids": ["1003418_139"], "query": "What is the current score of the game shown in the broadcast during this clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_139", "answer": "64 - 62 plays between the Chicago Bulls and Phoenix Suns, with the current score at 64-62.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_139.jpg", "clip": "assets/t9_clips/clip_1003418_139.mp4"}]}}, {"turn": 11, "tool": "video_qa", "abbrev": "VQ", "thought": "Repeat.", "arguments": {"video_ids": ["1003418_142"], "query": "What is the sequence of actions that takes place in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_142", "answer": "Kelly Oubre Jr. (#12) executed a steal for the Chicago Bulls against the Phoenix Suns. The current score is 67 - 65.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_142.jpg", "clip": "assets/t9_clips/clip_1003418_142.mp4"}]}}, {"turn": 12, "tool": "search_videos", "abbrev": "SV", "thought": "Switch to a player-scoped search (Devin Booker).", "arguments": {"query": "Kevin Durant 3-point jumper early third quarter", "game_ids": ["1003418"], "quarter": 3, "players": ["Kevin Durant"]}, "results": {"kind": "videos", "total": 0, "target_count": 0, "target_ranks": [], "top": [{"rank": null, "clip_id": "1003418_141", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_141.jpg", "clip": "assets/t9_clips/clip_1003418_141.mp4"}, {"rank": null, "clip_id": "1003418_148", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_148.jpg", "clip": "assets/t9_clips/clip_1003418_148.mp4"}, {"rank": null, "clip_id": "1003418_145", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_145.jpg", "clip": "assets/t9_clips/clip_1003418_145.mp4"}]}}, {"turn": 13, "tool": "search_videos", "abbrev": "SV", "thought": "Tighter temporal window.", "arguments": {"query": "", "game_ids": ["1003418"], "quarter": 3, "temporal_boundary": "65-85"}, "results": {"kind": "videos", "total": 0, "target_count": 0, "target_ranks": [], "top": [{"rank": null, "clip_id": "1003418_138", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_138.jpg", "clip": "assets/t9_clips/clip_1003418_138.mp4"}, {"rank": null, "clip_id": "1003418_139", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_139.jpg", "clip": "assets/t9_clips/clip_1003418_139.mp4"}]}}, {"turn": 14, "tool": "search_videos", "abbrev": "SV", "thought": "Tighter still.", "arguments": {"query": "", "game_ids": ["1003418"], "quarter": 3, "temporal_boundary": "68.8-81.0"}, "results": {"kind": "videos", "total": 0, "target_count": 0, "target_ranks": [], "top": [{"rank": null, "clip_id": "1003418_138", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_138.jpg", "clip": "assets/t9_clips/clip_1003418_138.mp4"}, {"rank": null, "clip_id": "1003418_139", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_139.jpg", "clip": "assets/t9_clips/clip_1003418_139.mp4"}]}}, {"turn": 15, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask the new clips.", "arguments": {"video_ids": ["1003418_144"], "query": "What is the sequence of actions that takes place in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_144", "answer": "Deandre Ayton, #22, attempted a 2-point layup from the restricted area using his right hand, showcasing a change of speed during a handoff while contested by Zach LaVine, #8. Nikola Vucevic, #9, recorded the rebound. Mo\u2026", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_144.jpg", "clip": "assets/t9_clips/clip_1003418_144.mp4"}]}}, {"turn": 16, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask.", "arguments": {"video_ids": ["1003418_148"], "query": "What is the jersey number of Kevin Durant in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_148", "answer": "5", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_148.jpg", "clip": "assets/t9_clips/clip_1003418_148.mp4"}]}}, {"turn": 17, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask.", "arguments": {"video_ids": ["1003418_148"], "query": "What is the current score of the game shown in the broadcast during this clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_148", "answer": "70 - 68 in favor of the Phoenix Suns against the Chicago Bulls.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_148.jpg", "clip": "assets/t9_clips/clip_1003418_148.mp4"}]}}, {"turn": 18, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask.", "arguments": {"video_ids": ["1003418_140"], "query": "What is the current score of the game shown in the broadcast during this clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_140", "answer": "The Chicago Bulls are facing off against the Phoenix Suns, with the score currently at 67 - 62.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_140.jpg", "clip": "assets/t9_clips/clip_1003418_140.mp4"}]}}, {"turn": 19, "tool": "search_videos", "abbrev": "SV", "thought": "One last video search \u2014 no query, just to surface candidates.", "arguments": {"query": "64-63 down to one", "game_ids": ["1003418"], "quarter": 3}, "results": {"kind": "videos", "total": 0, "target_count": 0, "target_ranks": [], "top": [{"rank": null, "clip_id": "1003418_140", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_140.jpg", "clip": "assets/t9_clips/clip_1003418_140.mp4"}, {"rank": null, "clip_id": "1003418_183", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_183.jpg", "clip": "assets/t9_clips/clip_1003418_183.mp4"}, {"rank": null, "clip_id": "1003418_142", "quarter": null, "is_target": false, "frame": "assets/t9_frames/clip_1003418_142.jpg", "clip": "assets/t9_clips/clip_1003418_142.mp4"}]}}, {"turn": 20, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask the final batch.", "arguments": {"video_ids": ["1003418_170"], "query": "What is the jersey number of Kevin Durant in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_170", "answer": "Cameron Payne (#15) executed a steal, while Deandre Ayton (#22) successfully made a steal of his own. The teams in action are the Chicago Bulls and the Phoenix Suns, with the current score at 78 - 83.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_170.jpg", "clip": "assets/t9_clips/clip_1003418_170.mp4"}]}}, {"turn": 21, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask.", "arguments": {"video_ids": ["1003418_145"], "query": "What is the jersey number of Kevin Durant in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_145", "answer": "Aaron Holiday, wearing #3, delivered a rebound for the Chicago Bulls against the Phoenix Suns. The current score is tied at 67 - 67.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_145.jpg", "clip": "assets/t9_clips/clip_1003418_145.mp4"}]}}, {"turn": 22, "tool": "video_qa", "abbrev": "VQ", "thought": "Ask.", "arguments": {"video_ids": ["1003418_142"], "query": "What is the jersey number of Kevin Durant in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_142", "answer": "Charles Bassey (#28) grabbed a rebound, while Nic Solomon (#20) executed a steal. The Chicago Bulls face off against the Phoenix Suns, with the game tied at 67 - 65.", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_142.jpg", "clip": "assets/t9_clips/clip_1003418_142.mp4"}]}}, {"turn": 23, "tool": "video_qa", "abbrev": "VQ", "thought": "Settles on '5' as the final answer.", "arguments": {"video_ids": ["1003418_148"], "query": "What is the sequence of actions that takes place in this video clip?"}, "results": {"kind": "videoqa", "results": [{"clip_id": "1003418_148", "answer": "Lauri Elias Markkanen executed a screen and then assisted Cameron Payne, who made a 2-point floater from the restricted area using his right hand while contested by Garrett Temple. The matchup features the Chicago Bulls\u2026", "is_target": false, "has_answer": false, "frame": "assets/t9_frames/clip_1003418_148.jpg", "clip": "assets/t9_clips/clip_1003418_148.mp4"}]}}], "final_answer": "5", "final_thought": "Twenty-three turns of probing, never sees a jersey number on screen. Picks '5'. Wrong \u2014 GT was '1'."};
const T3_ARCHIVE = {"panels": [{"id": "bb_jersey", "sport": "basketball", "axis_label": "jersey number", "query": "Find the clip where #55 makes a free throw.", "thumbs": [{"video": "assets/t3_archive/bb_jersey/gt.mp4", "caption": "Player #55 makes a free throw.", "sim": 0.62, "is_gt": true}, {"video": "assets/t3_archive/bb_jersey/hn1.mp4", "caption": "Player #24 makes a free throw.", "sim": 0.84, "diff_substring": "#24", "is_gt": false}, {"video": "assets/t3_archive/bb_jersey/hn2.mp4", "caption": "Player #8 makes a free throw.", "sim": 0.79, "diff_substring": "#8", "is_gt": false}, {"video": "assets/t3_archive/bb_jersey/hn3.mp4", "caption": "Player #6 makes a free throw.", "sim": 0.74, "diff_substring": "#6", "is_gt": false}]}, {"id": "bb_hand", "sport": "basketball", "axis_label": "shooting hand", "query": "Find the clip of a right-handed contested two-point jumper from the top.", "thumbs": [{"video": "assets/t3_archive/bb_hand/gt.mp4", "caption": "A right-handed contested jumper from the top.", "sim": 0.61, "is_gt": true}, {"video": "assets/t3_archive/bb_hand/hn1.mp4", "caption": "A left-handed contested jumper from the top.", "sim": 0.83, "diff_substring": "left-handed", "is_gt": false}, {"video": "assets/t3_archive/bb_hand/hn2.mp4", "caption": "A left-handed jumper from the top off a pick-and-roll.", "sim": 0.78, "diff_substring": "left-handed", "is_gt": false}, {"video": "assets/t3_archive/bb_hand/hn3.mp4", "caption": "A left-handed contested catch-and-shoot jumper.", "sim": 0.73, "diff_substring": "left-handed", "is_gt": false}]}, {"id": "soc_player", "sport": "soccer", "axis_label": "player name", "query": "K. Stoup wins a duel attacking from the right side.", "thumbs": [{"video": "assets/t3_archive/soc_player/gt.mp4", "caption": "K. Stoup wins a duel attacking from the right side.", "sim": 0.63, "is_gt": true}, {"video": "assets/t3_archive/soc_player/hn1.mp4", "caption": "A. Pope wins a duel attacking from the right side.", "sim": 0.82, "diff_substring": "A. Pope", "is_gt": false}, {"video": "assets/t3_archive/soc_player/hn2.mp4", "caption": "N\u00e9lson Semedo wins a duel attacking from the right side.", "sim": 0.77, "diff_substring": "N\u00e9lson Semedo", "is_gt": false}, {"video": "assets/t3_archive/soc_player/hn3.mp4", "caption": "Mart\u00edn Zubimendi wins a duel attacking from the right side.", "sim": 0.72, "diff_substring": "Mart\u00edn Zubimendi", "is_gt": false}]}, {"id": "hky_zone", "sport": "hockey", "axis_label": "shot type", "query": "A wrist shot in the offensive zone, with the goalie in the butterfly position.", "thumbs": [{"video": "assets/t3_archive/hky_zone/gt.mp4", "caption": "A wrist shot in the offensive zone, with the goalie in the butterfly position.", "sim": 0.6, "is_gt": true}, {"video": "assets/t3_archive/hky_zone/hn1.mp4", "caption": "A backhand shot in the offensive zone, with the goalie in the butterfly position.", "sim": 0.83, "diff_substring": "backhand", "is_gt": false}, {"video": "assets/t3_archive/hky_zone/hn2.mp4", "caption": "A deflection shot in the offensive zone, with the goalie in the butterfly position.", "sim": 0.78, "diff_substring": "deflection", "is_gt": false}, {"video": "assets/t3_archive/hky_zone/hn3.mp4", "caption": "A slapshot in the offensive zone, with the goalie in the butterfly position.", "sim": 0.73, "diff_substring": "slapshot", "is_gt": false}]}]};
const T9_ARCHIVE = {"cards": [{"id": "doc_only", "label": "Stuck in documents", "sport": "basketball", "tagline": "Never escalates to video \u2014 searches reports, then refuses.", "summary": "Searches game reports 12 times, questions them 4 times. Never invokes a video tool.", "question_short": "What shot type was the first made basket of the Heat player who tripled his usual first-quarter points?", "question_id": 34, "question": "In the matchup where a Heat player scored more than triple his usual first-quarter points for the season, what shot type was his very first made basket of the night?", "gt_answer": "Alley oop", "final_answer": "I cannot find the answer in the provided documents or videos.", "num_turns": 16, "tool_counts": {"search_documents": 12, "document_qa": 4}, "tool_seq": [{"turn": 1, "tool": "search_documents", "abbrev": "SD"}, {"turn": 2, "tool": "search_documents", "abbrev": "SD"}, {"turn": 3, "tool": "search_documents", "abbrev": "SD"}, {"turn": 4, "tool": "search_documents", "abbrev": "SD"}, {"turn": 5, "tool": "search_documents", "abbrev": "SD"}, {"turn": 6, "tool": "search_documents", "abbrev": "SD"}, {"turn": 7, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 8, "tool": "search_documents", "abbrev": "SD"}, {"turn": 9, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 10, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 11, "tool": "search_documents", "abbrev": "SD"}, {"turn": 12, "tool": "search_documents", "abbrev": "SD"}, {"turn": 13, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 14, "tool": "search_documents", "abbrev": "SD"}, {"turn": 15, "tool": "search_documents", "abbrev": "SD"}, {"turn": 16, "tool": "search_documents", "abbrev": "SD"}]}, {"id": "perception_bn", "label": "Video perception bottleneck", "sport": "hockey", "tagline": "Asks the clips, can't extract the right detail.", "summary": "Pivots to video early and asks 10 clips for the count. Settles on '8' \u2014 wrong.", "question_short": "From the opening faceoff to the Siegenthaler\u2013Schenn puck battle, how many takeaways happened in New Jersey's back-to-back road win?", "question_id": "perception_bn", "question": "In the game where New Jersey won back-to-back road games for the first time that season and also had an offside call on Yegor Sharangovich near the end of the first period, how many takeaways happened from the opening faceoff up to (and including) the puck battle between Jonas Siegenthaler and Brayden Schenn early in Period 1?", "gt_answer": "2", "final_answer": "8", "num_turns": 18, "tool_counts": {"search_documents": 2, "document_qa": 1, "search_videos": 5, "video_qa": 10}, "tool_seq": [{"turn": 1, "tool": "search_documents", "abbrev": "SD"}, {"turn": 2, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 3, "tool": "search_documents", "abbrev": "SD"}, {"turn": 4, "tool": "search_videos", "abbrev": "SV"}, {"turn": 5, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 6, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 7, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 8, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 9, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 10, "tool": "search_videos", "abbrev": "SV"}, {"turn": 11, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 12, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 13, "tool": "search_videos", "abbrev": "SV"}, {"turn": 14, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 15, "tool": "search_videos", "abbrev": "SV"}, {"turn": 16, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 17, "tool": "search_videos", "abbrev": "SV"}, {"turn": 18, "tool": "video_qa", "abbrev": "VQ"}]}, {"id": "aggregation_fail", "label": "Cross-clip aggregation failure", "sport": "soccer", "tagline": "Inspects each clip on its own, never tallies the pass types across them.", "summary": "23 turns and 21 video calls. The agent looks at one key pass at a time but never counts up the pass types across clips \u2014 returning a player name instead of a pass type.", "question_short": "In the Arsenal\u2013Everton match where Arsenal took over 20 shots and Everton just three, which pass type was most common among Arsenal's key passes?", "question_id": "aggregation_fail", "question": "In the match where Arsenal\u2019s first-half corner count was unusually high compared with Tottenham\u2019s, focus on the first-half moment when Tottenham\u2019s D. Spence committed a foul on R. Sterling after losing a defensive ground duel on the right side; who was the Arsenal player that had just won the interception and immediately passed to Sterling to start that chain?", "gt_answer": "cross", "final_answer": "B. White", "num_turns": 23, "tool_counts": {"search_videos": 7, "search_documents": 1, "document_qa": 1, "video_qa": 14}, "tool_seq": [{"turn": 1, "tool": "search_videos", "abbrev": "SV"}, {"turn": 2, "tool": "search_videos", "abbrev": "SV"}, {"turn": 3, "tool": "search_videos", "abbrev": "SV"}, {"turn": 4, "tool": "search_videos", "abbrev": "SV"}, {"turn": 5, "tool": "search_videos", "abbrev": "SV"}, {"turn": 6, "tool": "search_documents", "abbrev": "SD"}, {"turn": 7, "tool": "document_qa", "abbrev": "DQ"}, {"turn": 8, "tool": "search_videos", "abbrev": "SV"}, {"turn": 9, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 10, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 11, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 12, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 13, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 14, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 15, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 16, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 17, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 18, "tool": "search_videos", "abbrev": "SV"}, {"turn": 19, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 20, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 21, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 22, "tool": "video_qa", "abbrev": "VQ"}, {"turn": 23, "tool": "video_qa", "abbrev": "VQ"}]}]};

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
  }, "Using tools for searching through documents, asking questions about them, browsing video clips, and querying what happens in each clip, search through 33K game reports and 1.76M video clips across 7,430 games to answer:"), light && /*#__PURE__*/React.createElement("div", {
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
      background: revealedCount > turns.length ? tileColors ? '#71717a' : '#C0392B' : tileBgIdle,
      color: revealedCount > turns.length ? '#fafafa' : tileTextIdle,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 18,
      fontWeight: 700,
      outline: selectedIdx === turns.length ? '2px solid ' + selectedOutline : '2px solid transparent',
      outlineOffset: selectedIdx === turns.length ? 1 : 0,
      cursor: allRevealed && !noClick ? 'pointer' : 'default',
      transition: 'background 180ms, outline-color 120ms',
      userSelect: 'none'
    }
  }, "\u2717")), /*#__PURE__*/React.createElement("div", {
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
  // Narrative summaries: if `data.tool_summaries` exists (cliff), show a
  // vertical list with per-tool one-liners instead of the grid+counts.
  var summaries = data.tool_summaries;
  if (summaries && allRevealed) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: '"IBM Plex Sans", sans-serif'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: '0.1em',
        color: headerCol,
        textTransform: 'uppercase',
        fontFamily: '"IBM Plex Mono", monospace',
        marginBottom: 2
      }
    }, allRevealed ? 'Click any tile to inspect' : 'Tracing the agent…'), summaries.map(function (s) {
      return /*#__PURE__*/React.createElement("div", {
        key: s.abbrev,
        style: {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          fontSize: 12.5,
          lineHeight: 1.45
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 18,
          borderRadius: 3,
          background: s.abbrev === '✗' ? toolColor ? '#71717a' : '#C0392B' : _tc[s.key] || '#71717a',
          color: '#fafafa',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 11,
          fontWeight: 700,
          flex: '0 0 auto',
          marginTop: 2
        }
      }, s.abbrev), /*#__PURE__*/React.createElement("span", {
        style: {
          color: itemActive
        }
      }, s.text));
    }));
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
  var ids = args.doc_ids || [];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T9KV, {
    k: "doc_ids",
    v: "[".concat(ids.length, "] ").concat(ids.slice(0, 2).join(', ')).concat(ids.length > 2 ? '…' : ''),
    mono: true,
    light: light
  }), /*#__PURE__*/React.createElement(T9KV, {
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
  var ids = args.video_ids || [];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(T9KV, {
    k: "video_ids",
    v: "[".concat(ids.length, "]"),
    mono: true,
    light: light
  }), /*#__PURE__*/React.createElement(T9KV, {
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
  // Renders the contextual line that replaces the old "no target in pool".
  // - kind = 'docs' or 'clips'
  var noun = kind === 'docs' ? 'docs retrieved' : 'clips retrieved';
  var tr = results.target_ranks || [];
  var displayedRanks = (results.top || []).map(function (r) {
    return r.rank;
  });
  var suffix;
  if (tr.length === 0) {
    suffix = " \xB7 no target in top ".concat(results.total);
  } else {
    var inDisplayed = tr.filter(function (r) {
      return displayedRanks.includes(r);
    });
    if (inDisplayed.length > 0) {
      suffix = " \xB7 target at #".concat(inDisplayed.join(', #'));
    } else {
      // Target exists deeper in pool than the top we're showing.
      var first = tr[0];
      suffix = " \xB7 target at #".concat(first, " (deeper)");
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      color: tr.length > 0 ? '#2E9E8F' : '#71717a',
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, "Top ", displayedN, " of ", results.total, " ", noun, suffix);
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
    }, /*#__PURE__*/React.createElement("span", null, "#", d.rank, d.is_target ? ' · target ✓' : '', "  \xB7  ", d.doc_id)), d.teams && d.teams.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }));
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
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 9.5,
      color: '#71717a',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, results.results.length, " doc", results.results.length === 1 ? '' : 's', " answered"), results.results.slice(0, 2).map(function (r, i) {
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
    }, r.doc_id, " ", r.contains_answer ? '· ✓ contains answer' : '· no evidence'), /*#__PURE__*/React.createElement("div", {
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
      fontSize: 9.5,
      color: '#52525b',
      textAlign: 'right'
    }
  }, "+", results.results.length - 2, " more"));
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
    }, "#".concat(v.rank).concat(v.is_target ? ' ✓' : '')), hasClip && /*#__PURE__*/React.createElement("div", {
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
  })));
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
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11,
      color: targetCount > 0 ? '#2E9E8F' : '#71717a',
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, items.length, " clip", items.length === 1 ? '' : 's', " queried", targetCount > 0 ? " \xB7 ".concat(targetCount, " target") : ''), items.slice(0, 3).map(function (r, i) {
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
    }, r.clip_id, r.is_target ? ' · target ✓' : '', r.has_answer ? '' : ' · no evidence'), /*#__PURE__*/React.createElement("div", {
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
      fontSize: 11,
      color: '#52525b',
      textAlign: 'right'
    }
  }, "+", items.length - 3, " more"));
}
