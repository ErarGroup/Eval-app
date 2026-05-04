import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Link, useParams } from 'react-router-dom';
import './index.css';

const PILLARS = {
  mindset: ["Punctual", "Correct Uniform", "Coachable", "Positive", "Decision w/ Ball", "Creative w/ Ball", "Confidence w/ Ball", "Determination w/ Ball", "Verbal comms", "Body language", "Supports a play", "Performance consistency"],
  physical: ["Agility & coordination", "Foot Work", "Endurance", "Reaction & Awareness", "Speed & explosion"],
  technical: ["Ball control (receiving)", "Dribbling w/ ball", "Passing Ball", "Shooting Ball", "Trapping Ball", "Shielding the ball"],
  tactical: ["Positioning w/ ball", "Positioning NO ball", "Defensive movement", "Offensive movement", "Defensive Counter", "Offensive Counter"]
};

// Directly mapped from PDF definitions
const GLOSSARY: Record<string, string> = {
  "Punctual": "Arrives on time and is fully ready (gear, mindset) for all practice and game activities.",
  "Correct Uniform": "Wears all required and appropriate team gear as instructed for both practice and games.",
  "Coachable": "Actively listens to coaches, positively accepts feedback, and attempts to apply instructions immediately.",
  "Positive": "Maintains a positive attitude, encourages teammates, and recovers quickly from personal and team mistakes.",
  "Decision w/ Ball": "Chooses the correct action (pass, dribble, or shoot) quickly and effectively based on the immediate situation on the field.",
  "Creative w/ Ball": "Looks up to observe the field, recognizes open space or teammates, and attempts innovative solutions when pressured.",
  "Confidence w/ Ball": "Plays without fear of making mistakes, demands the ball from teammates, and remains calm under defensive pressure.",
  "Determination w/ Ball": "Exhibits a strong will to fight for possession, win 50/50 balls, and commit fully to defensive and offensive efforts.",
  "Verbal comms": "Clearly and effectively speaks to teammates (e.g., calling for the ball, providing warnings like 'Man On,' or giving tactical instructions).",
  "Body language": "Displays focused, motivated, and aggressive non-verbal signals, even after errors or during challenging moments.",
  "Supports a play": "Moves proactively off the ball to provide a passing option for a teammate or to cover a defensive space for a teammate.",
  "Performance consistency": "Maintains the same high level of focus, effort, and technical execution throughout the entire game or practice session.",
  "Agility & coordination": "Ability to change direction rapidly while running and performing soccer movements with balance and control.",
  "Foot Work": "Quickness and precision of small movements of the feet, such as shuffling, hopping, or subtle adjustments around the ball.",
  "Endurance": "The ability to sustain a high-intensity effort (running, sprinting) and technical quality for the full duration of the game.",
  "Reaction & Awareness": "Speed in noticing changes in the game (e.g., a loose ball, an open teammate) and initiating the correct movement or action.",
  "Speed & explosion": "The player's top-end running speed and their ability to accelerate quickly from a standing start or a slow jog.",
  "Ball control (receiving)": "The ability to cushion or redirect a pass with the first touch, setting the ball up perfectly for the next pass, dribble, or shot.",
  "Dribbling w/ ball": "Successfully advancing the ball and moving past defenders while maintaining close control and proper pace.",
  "Passing Ball": "Delivers the ball accurately to a teammate with the correct pace, angle, and to the intended foot or space.",
  "Shooting Ball": "Striking the ball accurately with power toward the goal.",
  "Trapping Ball": "Bringing the ball to a complete and controlled stop from the air or the ground.",
  "Shielding the ball": "Using the body to keep possession and physically block a defender from taking the ball away.",
  "Positioning w/ ball": "Selecting the correct space to drive, dribble, or pass the ball, then protecting it from opponents by using the body and choosing the best direction to move.",
  "Positioning NO ball": "Moving proactively off the ball into spaces that help the team, such as creating passing options or pulling defenders away.",
  "Defensive movement": "Coordinated individual and team movement to close down space, pressure the opponent, and deny passing lanes.",
  "Offensive movement": "Coordinated individual and team movement to create space, overload the opponent, and get into scoring positions.",
  "Defensive Counter": "The speed and decisiveness in transitioning immediately from attack to defense upon losing possession of the ball.",
  "Offensive Counter": "The speed and decisiveness in transitioning immediately from defense to attack upon winning possession of the ball."
};

const PRESET_STRENGTHS: Record<string, { advanced: string[], intermediate: string[], basic: string[] }> = {
  mindset: {
    advanced: [
      "Excellent focus and coachability",
      "Consistently displays a positive attitude",
      "Shows great determination in 50/50 challenges",
      "Very resilient after setbacks",
      "Shows strong work ethic every session",
      "Encourages teammates and lifts team spirit",
      "Great team leader on the field"
    ],
    intermediate: [
      "Stays focused during most of the session",
      "Responds well to coaching and correction",
      "Shows improving resilience after mistakes",
      "Demonstrates growing confidence in games",
      "Works hard and shows consistent effort",
      "Supports teammates and communicates more frequently",
      "Shows willingness to take on challenges"
    ],
    basic: [
      "Shows enthusiasm and willingness to participate",
      "Follows instructions with guidance",
      "Maintains a positive attitude throughout practice",
      "Shows effort in drills and small-sided games",
      "Demonstrates early signs of confidence",
      "Shows interest in learning and improving",
      "Displays good sportsmanship"
    ]
  },
  physical: {
    advanced: [
      "Incredible stamina throughout the match",
      "Great speed and explosiveness",
      "Strong body presence on the field",
      "Excellent coordination and balance",
      "Quick acceleration in short distances",
      "Shows great athletic potential"
    ],
    intermediate: [
      "Good overall speed and mobility",
      "Improving stamina during longer drills",
      "Shows developing strength in challenges",
      "Demonstrates better balance and coordination",
      "Reacts quicker in open-play situations",
      "Shows improving athletic form and mechanics"
    ],
    basic: [
      "Shows effort in running and physical drills",
      "Demonstrates basic coordination and balance",
      "Moves confidently in open space",
      "Shows improving endurance with repetition",
      "Participates actively in physical activities",
      "Demonstrates early athletic potential"
    ]
  },
  technical: {
    advanced: [
      "Fantastic ball control in tight spaces",
      "Excellent first touch when receiving",
      "Great shooting accuracy",
      "Consistent and accurate passing range",
      "Strong ball-striking mechanics",
      "Shows creativity with the ball"
    ],
    intermediate: [
      "Good ball control in open space",
      "Improving first touch under light pressure",
      "Accurate short-range passing",
      "Shows developing shooting technique",
      "Demonstrates improving dribbling ability",
      "Shows willingness to use both feet"
    ],
    basic: [
      "Demonstrates basic ball-handling skills",
      "Can pass and receive with guidance",
      "Shows improving dribbling in open space",
      "Developing comfort with ball striking",
      "Shows progress in simple technical drills",
      "Demonstrates early coordination with the ball"
    ]
  },
  tactical: {
    advanced: [
      "Excellent spatial awareness",
      "Smart decision-making in the final third",
      "Great offensive overlapping runs",
      "Quick transition from attack to defense",
      "Reads the game well under pressure",
      "Very effective in small-sided tactical moments"
    ],
    intermediate: [
      "Understands basic positioning",
      "Shows improving awareness of space",
      "Makes better decisions with more repetition",
      "Transitions quicker between phases of play",
      "Shows developing understanding of team shape",
      "Recognizes simple tactical cues"
    ],
    basic: [
      "Understands simple positional roles",
      "Follows the flow of play with guidance",
      "Shows improving awareness of teammates",
      "Demonstrates early understanding of spacing",
      "Responds to basic tactical instructions",
      "Shows progress in small-sided games"
    ]
  }
};

const PRESET_GROWTH: Record<string, { advanced: string[], intermediate: string[], basic: string[] }> = {
  mindset: {
    advanced: [
      "Needs to stay calm under pressure",
      "Must improve reaction to mistakes",
      "Needs to improve communication with teammates",
      "Needs to stay engaged when off the ball",
      "Needs to improve listening during instructions"
    ],
    intermediate: [
      "Needs to build consistency in focus",
      "Hesitates after errors; needs quicker reset",
      "Needs to speak up more during play",
      "Needs reminders to stay mentally engaged",
      "Needs to follow instructions with fewer repetitions",
      "Needs to develop stronger competitive mentality"
    ],
    basic: [
      "Easily distracted; needs help staying focused",
      "Struggles to recover emotionally after mistakes",
      "Needs encouragement to participate verbally",
      "Needs guidance to stay involved in activities",
      "Needs support understanding instructions",
      "Needs confidence-building to stay motivated"
    ]
  },
  physical: {
    advanced: [
      "Improve agility drills and foot speed",
      "Requires better reaction time to loose balls",
      "Needs extra fitness conditioning",
      "Needs to work on endurance during longer drills",
      "Needs to improve overall strength",
      "Needs to improve recovery between sprints"
    ],
    intermediate: [
      "Needs to improve change-of-direction quickness",
      "Needs quicker reactions in game moments",
      "Needs to build stamina for full-session intensity",
      "Needs to improve core strength",
      "Needs better consistency in sprint mechanics",
      "Needs to improve flexibility and mobility"
    ],
    basic: [
      "Needs to improve basic coordination",
      "Needs to build general endurance",
      "Needs help developing balance and stability",
      "Needs to improve running form",
      "Needs to build foundational strength",
      "Needs to improve overall physical confidence"
    ]
  },
  technical: {
    advanced: [
      "Improve dribbling past defenders at pace",
      "Work on shielding the ball better",
      "Needs to practice weaker-foot passing",
      "Needs to improve crossing technique",
      "Needs to work on receiving under pressure",
      "Needs to improve long-range passing accuracy"
    ],
    intermediate: [
      "Needs to improve dribbling control in traffic",
      "Needs to strengthen first touch under light pressure",
      "Needs to improve passing consistency",
      "Needs to develop better shooting mechanics",
      "Needs to improve ball protection",
      "Needs to improve accuracy with both feet"
    ],
    basic: [
      "Needs to improve basic ball control",
      "Needs help with simple passing and receiving",
      "Needs to build comfort dribbling in open space",
      "Needs to improve coordination with the ball",
      "Needs to learn proper striking technique",
      "Needs to improve first touch fundamentals"
    ]
  },
  tactical: {
    advanced: [
      "Needs to drop back faster on defense",
      "Work on positioning without the ball",
      "Needs better anticipation of opponent movements",
      "Needs to improve marking responsibilities",
      "Needs to recognize when to switch the play",
      "Needs to improve timing of runs behind defenders"
    ],
    intermediate: [
      "Needs to understand spacing more consistently",
      "Needs to improve decision-making under pressure",
      "Needs to react quicker in transition moments",
      "Needs to improve defensive positioning",
      "Needs to recognize simple tactical cues",
      "Needs to improve awareness of teammates' movement"
    ],
    basic: [
      "Needs help understanding basic positions",
      "Needs reminders to stay in shape/formations",
      "Needs to follow the play with more awareness",
      "Needs to learn simple defensive responsibilities",
      "Needs to understand when to move into space",
      "Needs to improve basic game understanding"
    ]
  }
};

const PRESET_VIDEOS: Record<string, { advanced: { strength: string[], growth: string[] }, intermediate: { strength: string[], growth: string[] }, basic: { strength: string[], growth: string[] } }> = {
  mindset: {
    advanced: {
      strength: ["Leadership on the Pitch","Building Confidence","Communication Exercises","Focus Drill","Staying Engaged Off the Ball","Pre-Game Mental Preparation"],
      growth:   ["Handling Pressure","Overcoming Mistakes","Aggressive Mentality","Emotional Control During Games","Growth Mindset for Young Athletes","Staying Positive After Errors"]
    },
    intermediate: {
      strength: ["Confidence-building routines","Positive self-talk habits","Basic communication exercises","Staying focused during drills","Mental reset after mistakes","Encouraging teammates"],
      growth:   ["Managing frustration","Staying engaged when off the ball","Learning to communicate consistently","Improving attention during instructions","Building competitive mentality","Recovering quickly after errors"]
    },
    basic: {
      strength: ["Simple focus exercises","Encouraging participation","Building comfort in group settings","Following instructions with support","Positive attitude reinforcement","Basic teamwork habits"],
      growth:   ["Staying focused for short periods","Learning to handle mistakes calmly","Building confidence in new situations","Understanding simple instructions","Staying involved in activities","Developing emotional control"]
    }
  },
  physical: {
    advanced: {
      strength: ["Sprint Mechanics","Plyometric Explosiveness","Balance & Coordination","Acceleration Drills","Footwork Patterns for Quickness","Speed Endurance Training"],
      growth:   ["Agility Ladder","Reaction Speed Training","Stamina Drills","Core Strength for Soccer","Youth Strength Basics (Bodyweight)","Flexibility & Mobility for Soccer"]
    },
    intermediate: {
      strength: ["Basic sprint form","Coordination and balance drills","Light plyometrics","Short-distance acceleration","Simple footwork patterns","Intro to speed endurance"],
      growth:   ["Agility cone patterns","Reaction ball drills","Jog-to-sprint stamina sets","Core stability exercises","Bodyweight strength routines","Stretching and mobility basics"]
    },
    basic: {
      strength: ["Basic running form","Simple balance exercises","Light coordination games","Intro to footwork patterns","Short movement activities","Beginner endurance play"],
      growth:   ["Basic agility movements","Simple reaction games","Building stamina gradually","Foundational strength (bodyweight)","Basic flexibility routines","Learning proper warm-up habits"]
    }
  },
  technical: {
    advanced: {
      strength: ["Ball Mastery","First Touch Control","Shooting Technique","Wall Passing","Turning Moves (Cruyff, Inside/Outside Cut)","Juggling Progressions"],
      growth:   ["1v1 Dribbling Moves","Shielding the Ball Better","Weak Foot Development","Receiving Under Pressure","Crossing Technique","Long-Range Passing"]
    },
    intermediate: {
      strength: ["Basic ball mastery","First touch in open space","Short-range passing","Simple turning moves","Controlled shooting technique","Juggling basics"],
      growth:   ["Dribbling with more control","Ball protection fundamentals","Weak-foot passing basics","Receiving with light pressure","Improving crossing form","Medium-range passing accuracy"]
    },
    basic: {
      strength: ["Simple ball touches","Basic dribbling in open space","Passing and receiving with guidance","Basic shooting form","Simple turns","Intro to juggling"],
      growth:   ["Improving ball control","Learning to pass accurately","Receiving the ball cleanly","Dribbling with confidence","Basic ball-striking technique","Simple directional control"]
    }
  },
  tactical: {
    advanced: {
      strength: ["Spatial Awareness","Scanning the Field","Attacking Runs","Off-the-Ball Movement","Counter Attacking Speed","Playing Out of the Back"],
      growth:   ["Defensive Positioning","Pressing Triggers","Understanding Width & Depth","Transition Moments","When to Switch the Play","Reading Opponent Body Language"]
    },
    intermediate: {
      strength: ["Basic scanning habits","Simple attacking runs","Understanding spacing","Transition awareness","Off-ball support movements","Playing simple combinations"],
      growth:   ["Defensive shape basics","Anticipating simple cues","Understanding width and depth","Faster reaction in transitions","Recognizing passing options","Timing basic runs"]
    },
    basic: {
      strength: ["Following the play","Staying in basic positions","Simple movement into space","Understanding teammates' roles","Basic transition habits","Simple passing options"],
      growth:   ["Learning positions","Staying in formation","Understanding where to move","Basic defensive responsibilities","Recognizing open space","Following simple tactical cues"]
    }
  }
};

export default function App() {
  const { id } = useParams();
  const [playerInfo, setPlayerInfo] = useState({
    program: [] as string[], name: '', age: '', team: '', date: new Date().toISOString().split('T')[0], coach: '', emails: [] as string[]
  });

  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState({
    mindset:  { strength: '-- Select a Strength --',  growth: '-- Select an Area for Growth --', video: '-- Work on your own --' },
    physical: { strength: '-- Select a Strength --',  growth: '-- Select an Area for Growth --', video: '-- Work on your own --' },
    technical:{ strength: '-- Select a Strength --',  growth: '-- Select an Area for Growth --', video: '-- Work on your own --' },
    tactical: { strength: '-- Select a Strength --',  growth: '-- Select an Area for Growth --', video: '-- Work on your own --' }
  });

  const [targets, setTargets] = useState<any>({ mindsetAvg: 3.0, physicalAvg: 3.0, technicalAvg: 3.0, tacticalAvg: 3.0 });
  const [allEvals, setAllEvals] = useState<any[]>([]);
  const [allTeamTargets, setAllTeamTargets] = useState<any[]>([]); 
  const [roster, setRoster] = useState<any[]>([]);
  
  const [finalClosingThoughts, setFinalClosingThoughts] = useState('');

  useEffect(() => {
    fetch('/api/roster')
      .then(res => res.json())
      .then(data => { if(data) setRoster(data); })
      .catch(console.error);

    fetch('/api/targets')
      .then(res => res.json())
      .then(data => { if(data) setTargets(data); })
      .catch(console.error);

    fetch('/api/team-targets')
      .then(res => res.json())
      .then(data => { if(data) setAllTeamTargets(data); })
      .catch(console.error);

    fetch('/api/evaluations')
      .then(res => res.json())
      .then(data => { if(data) setAllEvals(data); })
      .catch(console.error);

    if (id) {
      fetch(`/api/evaluations/${id}`)
        .then(res => res.json())
        .then(ev => {
          if (!ev || ev.error) return;
          fetch('/api/roster').then(r => r.json()).then(rosterData => {
            const match = rosterData.find((r: any) => r.name === ev.playerName && r.team === ev.team);
            setPlayerInfo({
              program: match ? [match.program] : ['Unknown'], 
              name: ev.playerName, 
              age: ev.age, 
              team: ev.team, 
              date: ev.date, 
              coach: ev.coach, 
              emails: match && match.emails ? match.emails : []
            });
            if (ev.detailedScores) setScores(JSON.parse(ev.detailedScores));
            if (ev.comments) {
              const parsedComments = JSON.parse(ev.comments);
              setFinalClosingThoughts(parsedComments.finalCoachAssessment || '');
              delete parsedComments.finalCoachAssessment;
              setComments(parsedComments);
            }
            setTimeout(() => { window.print(); }, 1500);
          });
        })
        .catch(console.error);
    }
  }, [id]);

  const handleScore = (item: string, score: number) => setScores(prev => ({ ...prev, [item]: score }));

  const calculateAverage = (pillarKey: keyof typeof PILLARS) => {
    const items = PILLARS[pillarKey];
    let sum = 0, count = 0;
    items.forEach(i => {
      if (scores[i]) { sum += scores[i]; count++; }
    });
    return count === 0 ? "0.0" : (sum / count).toFixed(1);
  };

  const getRatingClass = (item: string, val: number) => {
    if (scores[item] !== val) return '';
    return `active-${val}`;
  };

  const teamEvals = playerInfo.team ? allEvals.filter(e => e.team.toLowerCase() === playerInfo.team.toLowerCase()) : [];
  
  const getTeamAvg = (field: string) => {
    if(!teamEvals.length) return "N/A";
    const sum = teamEvals.reduce((acc, curr) => acc + curr[field], 0);
    return (sum / teamEvals.length).toFixed(1);
  };
  
  const getDisplayTeamAvg = (field: string) => {
    if (playerInfo.team) {
       const match = allTeamTargets.find(t => t.teamName === playerInfo.team.toLowerCase());
       if (match) return match[field].toFixed(1);
    }
    return getTeamAvg(field);
  };

  const getTeamAvgFloat = (field: string) => {
    if (playerInfo.team) {
       const match = allTeamTargets.find(t => t.teamName === playerInfo.team.toLowerCase());
       if (match) return match[field];
    }
    const avg = getTeamAvg(field);
    return avg === "N/A" ? 3.0 : parseFloat(avg);
  };

  const chartData = [
    { subject: 'Mindset', Player: parseFloat(calculateAverage('mindset')), Club: targets.mindsetAvg, Team: getTeamAvgFloat('mindsetAvg'), fullMark: 4 },
    { subject: 'Physical', Player: parseFloat(calculateAverage('physical')), Club: targets.physicalAvg, Team: getTeamAvgFloat('physicalAvg'), fullMark: 4 },
    { subject: 'Technical', Player: parseFloat(calculateAverage('technical')), Club: targets.technicalAvg, Team: getTeamAvgFloat('technicalAvg'), fullMark: 4 },
    { subject: 'Tactical', Player: parseFloat(calculateAverage('tactical')), Club: targets.tacticalAvg, Team: getTeamAvgFloat('tacticalAvg'), fullMark: 4 },
  ];

  /* 
    PRE-FLIGHT VALIDATION: Enforce all 28 scores and populated selections 
  */
  const handlePreFlightReview = () => {
    const totalFilled = Object.keys(scores).length;
    if (totalFilled < 28) {
      alert(`Missing Evaluations! You have only scored ${totalFilled} out of 28 player metrics. All items must be evaluated before submitting.`);
      return;
    }

    for (const pillar of ['mindset', 'physical', 'technical', 'tactical']) {
       const obj = comments[pillar as keyof typeof comments];
       if (obj.strength.includes('-- Select a Strength')) {
         alert(`Missing Strength in your ${pillar.toUpperCase()} section.`);
         return;
       }
       if (obj.growth.includes('-- Select an Area')) {
         alert(`Missing Area for Growth in your ${pillar.toUpperCase()} section.`);
         return;
       }
       if (obj.video.includes('-- Work on your own --')) {
         alert(`Missing "Work on your own" selection in your ${pillar.toUpperCase()} section.`);
         return;
       }
    }

    if (playerInfo.program.length === 0 || !playerInfo.team || !playerInfo.name) {
      alert('Missing Player Information! Ensure Program, Team, and Player Name are selected.');
      return;
    }

    extractFinalSubmitThenPrint();
  };

  const extractFinalSubmitThenPrint = async () => {
    // Bind final closing thoughts securely into comments JSON array
    const compiledCommentsData = {
      ...comments,
      finalCoachAssessment: finalClosingThoughts
    };

    const payload = {
      playerName: playerInfo.name,
      age: playerInfo.age || "Unknown",
      team: playerInfo.team,
      date: playerInfo.date,
      coach: playerInfo.coach || "Unknown",
      mindsetAvg: parseFloat(calculateAverage('mindset')),
      physicalAvg: parseFloat(calculateAverage('physical')),
      technicalAvg: parseFloat(calculateAverage('technical')),
      tacticalAvg: parseFloat(calculateAverage('tactical')),
      detailedScores: JSON.stringify(scores),
      comments: JSON.stringify(compiledCommentsData),
      parentEmails: playerInfo.emails
    };
    
    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert('Evaluation formally logged! System verification Email dispatched to dos@deltonasoccer.com.');
      }
    } catch(e) {
      console.error('Network issue: Backend not detected.', e);
    }

    // Trigger native PDF render sequence
    setTimeout(() => { window.print(); }, 500);
  };

  const toggleProgram = (prog: string) => {
    setPlayerInfo(prev => {
      const exists = prev.program.includes(prog);
      const newArr = exists ? prev.program.filter(p => p !== prog) : [...prev.program, prog];
      // Force clearing dependent dropdowns whenever upper tree changes
      return { ...prev, program: newArr, team: '', age: '', name: '' };
    });
  };

  const renderSection = (title: string, objKey: keyof typeof PILLARS, items: string[], delay: number) => (
    <div className={`card animate-slide-in`} style={{ animationDelay: `${delay}s`, position: 'relative' }}>
      <h2 className="section-title">{title} - Avg: {calculateAverage(objKey)}</h2>
      
      <div className="print-hide" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--border-color)' }}>
        <span style={{ color: 'var(--score-1)' }}>1: Needs Work</span>
        <span style={{ color: 'var(--score-2)' }}>2: Satisfactory</span>
        <span style={{ color: 'var(--score-3)' }}>3: Good</span>
        <span style={{ color: 'var(--score-4)' }}>4: Excellent</span>
      </div>

      <div className="evaluations">
        {items.map((item) => (
          <div className="evaluation-row" key={item}>
            <span className="evaluation-label">
               {item}
               <div className="tooltip-container">
                  i
                  <span className="tooltip-text">{GLOSSARY[item] || "Definition not mapped."}</span>
               </div>
            </span>
            <div className="rating-group print-hide">
              {[1, 2, 3, 4].map(val => (
                <button
                  key={val}
                  type="button"
                  className={`rating-btn ${getRatingClass(item, val)}`}
                  onClick={() => handleScore(item, val)}
                >
                  {val}
                </button>
              ))}
            </div>
            <span className="rating-badge print-only">[{scores[item] || '-'}]</span>
          </div>
        ))}
      </div>
      
      <div className="comments-section print-hide" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <div className="form-group">
          <label>⭐ Strengths: <span style={{color: 'red'}}>*</span></label>
          <select 
             value={comments[objKey as keyof typeof comments].strength}
             onChange={e => setComments(prev => ({ ...prev, [objKey]: { ...prev[objKey as keyof typeof comments], strength: e.target.value } }))}
             style={{ borderColor: comments[objKey as keyof typeof comments].strength.includes('--') ? 'rgba(239, 68, 68, 0.4)' : '' }}
          >
            <option value="-- Select a Strength --">-- Select a Strength --</option>
            <optgroup label="🏆 Advanced (Competitive Level)">
              {PRESET_STRENGTHS[objKey].advanced.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="📊 Intermediate (Developmental Level)">
              {PRESET_STRENGTHS[objKey].intermediate.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="🌱 Basic (Recreational / Beginner Level)">
              {PRESET_STRENGTHS[objKey].basic.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
          </select>
        </div>
        <div className="form-group">
          <label>📈 Areas for Growth: <span style={{color: 'red'}}>*</span></label>
          <select 
             value={comments[objKey as keyof typeof comments].growth}
             onChange={e => setComments(prev => ({ ...prev, [objKey]: { ...prev[objKey as keyof typeof comments], growth: e.target.value } }))}
             style={{ borderColor: comments[objKey as keyof typeof comments].growth.includes('--') ? 'rgba(239, 68, 68, 0.4)' : '' }}
          >
            <option value="-- Select an Area for Growth --">-- Select an Area for Growth --</option>
            <optgroup label="🏆 Advanced (Competitive Level)">
              {PRESET_GROWTH[objKey].advanced.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="📊 Intermediate (Developmental Level)">
              {PRESET_GROWTH[objKey].intermediate.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="🌱 Basic (Recreational / Beginner Level)">
              {PRESET_GROWTH[objKey].basic.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
          </select>
        </div>
        <div className="form-group">
          <label>🏃 Work on your own: <span style={{color: 'red'}}>*</span></label>
          <select 
             value={comments[objKey as keyof typeof comments].video}
             onChange={e => setComments(prev => ({ ...prev, [objKey]: { ...prev[objKey as keyof typeof comments], video: e.target.value } }))}
             style={{ borderColor: comments[objKey as keyof typeof comments].video.includes('--') ? 'rgba(239, 68, 68, 0.4)' : '' }}
          >
            <option value="-- Work on your own --">-- Work on your own --</option>
            <optgroup label="🏆 Advanced — ⭐ Strength-Reinforcing">
              {PRESET_VIDEOS[objKey].advanced.strength.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="🏆 Advanced — 📈 Growth-Focused">
              {PRESET_VIDEOS[objKey].advanced.growth.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="📊 Intermediate — ⭐ Strength-Reinforcing">
              {PRESET_VIDEOS[objKey].intermediate.strength.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="📊 Intermediate — 📈 Growth-Focused">
              {PRESET_VIDEOS[objKey].intermediate.growth.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="🌱 Basic — ⭐ Strength-Reinforcing">
              {PRESET_VIDEOS[objKey].basic.strength.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
            <optgroup label="🌱 Basic — 📈 Growth-Focused">
              {PRESET_VIDEOS[objKey].basic.growth.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );

  // Cascading Field Computations mapping off Multiple selections
  const availablePrograms = [...new Set(roster.map(r => r.program))]
    .filter(Boolean)
    .filter(p => !['camp', 'special program', 'topsoccer', 'top soccer'].includes(p.toLowerCase()))
    .sort();
  const availableTeams = [...new Set(roster
    .filter(r => playerInfo.program.length > 0 ? playerInfo.program.includes(r.program) : true)
    .map(r => r.team)
  )].filter(Boolean).sort();
  const availableAges = [...new Set(roster
    .filter(r => playerInfo.program.length > 0 ? playerInfo.program.includes(r.program) : true)
    .filter(r => playerInfo.team ? r.team === playerInfo.team : true)
    .map(r => r.age)
  )].filter(Boolean).sort();
  const availableNames = [...new Set(roster
    .filter(r => playerInfo.program.length > 0 ? playerInfo.program.includes(r.program) : true)
    .filter(r => playerInfo.team ? r.team === playerInfo.team : true)
    .map(r => r.name)
  )].filter(Boolean).sort();

  return (
    <>
      <div className="print-only raw-cover-page">
        <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, padding: 0 }}>DYSC</h1>
          <h2 style={{ fontSize: '2rem', color: '#555', margin: 0, padding: 0 }}>Player Evaluation Rubric</h2>
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>Official Assessment Standards Document</p>
        </div>
        
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>The Four Pillars</h3>
          <ul style={{ fontSize: '1.1rem', lineHeight: 2, marginTop: '1rem', listStyleType: 'disc', paddingLeft: '1rem' }}>
            <li><b>Mindset & Behavior:</b> Punctuality, Coachability, Positivity, Decision making, Determination.</li>
            <li><b>Physical & Conditioning:</b> Agility, Footwork, Endurance, Reaction, Speed.</li>
            <li><b>Technical Skills:</b> Ball control, Dribbling, Passing, Shooting, Shielding.</li>
            <li><b>Tactical Awareness:</b> Positioning, Defensive Movement, Offensive Movement, Countering.</li>
          </ul>
        </div>
      
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', marginTop: '3rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.5rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>Score Meaning Matrix</h3>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', fontSize: '1rem' }}>
            <tbody>
              <tr style={{ background: '#eee' }}>
                <td style={{ padding: '0.75rem', border: '1px solid black', fontWeight: 'bold' }}>[ 1 ] Needs Work</td>
                <td style={{ padding: '0.75rem', border: '1px solid black' }}>Rarely demonstrates the skill. Needs significant focus and training in this area.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', border: '1px solid black', fontWeight: 'bold' }}>[ 2 ] Satisfactory</td>
                <td style={{ padding: '0.75rem', border: '1px solid black' }}>Demonstrates the skill sometimes. Developing but inconsistent under pressure.</td>
              </tr>
              <tr style={{ background: '#eee' }}>
                <td style={{ padding: '0.75rem', border: '1px solid black', fontWeight: 'bold' }}>[ 3 ] Good</td>
                <td style={{ padding: '0.75rem', border: '1px solid black' }}>Consistently demonstrates the skill in most situations with reasonable control.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', border: '1px solid black', fontWeight: 'bold' }}>[ 4 ] Excellent</td>
                <td style={{ padding: '0.75rem', border: '1px solid black' }}>Mastered the skill. Executes flawlessly under high gametime pressure.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="container">
        <header className="header print-header" style={{ position: 'relative' }}>
          <h1>DYSC <span className="gradient-text print-black">Evaluation Pro</span></h1>
          <p>Dynamic Player Assessment & Insights Platform</p>
        </header>

        <div className="card animate-slide-in" style={{ animationDelay: '0s' }}>
          <h2 className="section-title">Player Information</h2>
          <div className="grid" style={{ marginBottom: '1.5rem', display: 'block' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
               <label>Select a Program</label>
               {availablePrograms.length > 0 ? (
                 <div className="program-checkbox-list" style={{ alignItems: 'center' }}>
                    {availablePrograms.map(prog => (
                       <label key={prog}>
                         <input 
                           type="checkbox" 
                           checked={playerInfo.program.includes(prog)}
                           onChange={() => toggleProgram(prog)}
                         />
                         {prog}
                       </label>
                    ))}
                    
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '2px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ margin: 0, fontSize: '0.9rem' }}>Date:</label>
                          <input type="date" value={playerInfo.date} onChange={e => setPlayerInfo({...playerInfo, date: e.target.value})} style={{ padding: '0.4rem', width: 'auto', height: '36px' }} />
                       </div>
                    </div>
                 </div>
               ) : (
                 <input type="text" value={playerInfo.program.join(', ')} placeholder="Database linking..." readOnly />
               )}
            </div>
          </div>
          
          <div className="grid">
            <div className="form-group">
               <label>Team</label>
               {availableTeams.length > 0 ? (
                 <select value={playerInfo.team} onChange={e => {
                    setPlayerInfo({...playerInfo, team: e.target.value, name: '', age: ''}); 
                 }}>
                   <option value="">-- Select Team --</option>
                   {Array.from(new Set([...availableTeams, playerInfo.team])).filter(Boolean).map(team => <option key={team} value={team}>{team}</option>)}
                 </select>
               ) : (
                 <input type="text" value={playerInfo.team} onChange={e => setPlayerInfo({...playerInfo, team: e.target.value})} placeholder="e.g. DYSC Gold" />
               )}
            </div>

            <div className="form-group">
               <label>Age/Division</label>
               {availableAges.length > 0 ? (
                 <select value={playerInfo.age} onChange={e => setPlayerInfo({...playerInfo, age: e.target.value})}>
                   <option value="">-- Select Division --</option>
                   {Array.from(new Set([...availableAges, playerInfo.age])).filter(Boolean).map(age => <option key={age} value={age}>{age}</option>)}
                 </select>
               ) : (
                 <input type="text" value={playerInfo.age} onChange={e => setPlayerInfo({...playerInfo, age: e.target.value})} placeholder="e.g. U12" />
               )}
            </div>

            <div className="form-group">
               <label>Player Name <span style={{color: 'red'}}>*</span></label>
               {availableNames.length > 0 && (
                 <select value={availableNames.includes(playerInfo.name) ? playerInfo.name : (playerInfo.name ? '___OTHER___' : '')} onChange={e => {
                   const selName = e.target.value;
                   if (selName === '___OTHER___') {
                     setPlayerInfo({...playerInfo, name: ' ', emails: []});
                   } else {
                     const match = roster.find(r => r.name === selName && r.team === playerInfo.team);
                     setPlayerInfo({...playerInfo, name: selName, emails: match && match.emails ? match.emails : []});
                   }
                 }} style={{ borderColor: !playerInfo.name ? 'rgba(239, 68, 68, 0.4)' : '' }}>
                   <option value="">-- Select Player --</option>
                   {Array.from(new Set([...availableNames, playerInfo.name])).filter(Boolean).map(name => <option key={name} value={name}>{name}</option>)}
                   <option value="___OTHER___">+ Add New Player...</option>
                 </select>
               )}
               {(availableNames.length === 0 || (playerInfo.name !== '' && !availableNames.includes(playerInfo.name))) && (
                 <input 
                   type="text" 
                   value={playerInfo.name === ' ' ? '' : playerInfo.name} 
                   onChange={e => setPlayerInfo({...playerInfo, name: e.target.value})} 
                   placeholder={availableNames.length > 0 ? "Type New Player Name..." : "Player Name"} 
                   style={{ borderColor: !playerInfo.name ? 'rgba(239, 68, 68, 0.4)' : '', marginTop: availableNames.length > 0 ? '0.5rem' : '0' }} 
                   autoFocus={availableNames.length > 0} 
                 />
               )}
               
               {playerInfo.emails && playerInfo.emails.length > 0 && (
                  <small style={{ color: 'var(--score-3)', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                    <span role="img" aria-label="email">📧</span> Linked Emails: {playerInfo.emails.join(', ')}
                  </small>
               )}
            </div>
            

          </div>
        </div>

        <div className="card summary-card animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title">Player Performance Snapshot</h2>
          <div className="summary-content" style={{ flexDirection: 'column' }}>
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Pillar</th>
                  <th>Player Score</th>
                  <th>Team Avg</th>
                  <th>DYSC Avg</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Mindset</strong></td>
                  <td><b style={{ color: 'var(--score-3)', fontSize: '1.2rem' }} className="print-black">{calculateAverage('mindset')}</b></td>
                  <td>{getDisplayTeamAvg('mindsetAvg')}</td>
                  <td>{targets.mindsetAvg.toFixed(1)}</td>
                </tr>
                <tr>
                  <td><strong>Physical</strong></td>
                  <td><b style={{ color: 'var(--score-3)', fontSize: '1.2rem' }} className="print-black">{calculateAverage('physical')}</b></td>
                  <td>{getDisplayTeamAvg('physicalAvg')}</td>
                  <td>{targets.physicalAvg.toFixed(1)}</td>
                </tr>
                <tr>
                  <td><strong>Technical</strong></td>
                  <td><b style={{ color: 'var(--score-3)', fontSize: '1.2rem' }} className="print-black">{calculateAverage('technical')}</b></td>
                  <td>{getDisplayTeamAvg('technicalAvg')}</td>
                  <td>{targets.technicalAvg.toFixed(1)}</td>
                </tr>
                <tr>
                  <td><strong>Tactical</strong></td>
                  <td><b style={{ color: 'var(--score-3)', fontSize: '1.2rem' }} className="print-black">{calculateAverage('tactical')}</b></td>
                  <td>{getDisplayTeamAvg('tacticalAvg')}</td>
                  <td>{targets.tacticalAvg.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
              <div className="chart-wrapper" style={{ flex: 1, minWidth: '300px', maxWidth: '600px' }}>
                 <ResponsiveContainer width="100%" height={350}>
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                     <PolarGrid />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-color)', fontWeight: 600 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fill: 'var(--text-color)' }} />
                     <Radar name="Player Score" dataKey="Player" stroke="#000000" fill="#000000" fillOpacity={0.6} />
                     <Radar name="Team Avg" dataKey="Team" stroke="#22c55e" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                     <Radar name="Club Avg" dataKey="Club" stroke="#3b82f6" fill="transparent" strokeWidth={2} strokeDasharray="3 3" />
                     <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                   </RadarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="print-page-break print-only"></div>

        <div className="print-grid">
           {renderSection("1. Mindset & Behavior", "mindset", PILLARS.mindset, 0.2)}
           {renderSection("2. Physical Conditioning", "physical", PILLARS.physical, 0.3)}
           {renderSection("3. Technical Skills", "technical", PILLARS.technical, 0.4)}
           {renderSection("4. Tactical Awareness", "tactical", PILLARS.tactical, 0.5)}
        </div>

        <div className="card animate-slide-in print-hide" style={{ animationDelay: '0.6s' }}>
           <h2 className="section-title">Final Submit</h2>
           <p style={{marginBottom: '1rem', color: 'var(--text-color)', opacity: 0.8}}>
             The system will automatically validate all 28 responses and required dropdown fields. 
           </p>

           <div className="form-group" style={{ marginBottom: '1.5rem' }}>
             <label>Coach's final comments & recommendations</label>
             <textarea 
               rows={4} 
               value={finalClosingThoughts}
               onChange={(e) => setFinalClosingThoughts(e.target.value)}
               placeholder="e.g. Julián has shown tremendous growth this quarter. His technical skills are adapting well to game scenarios..."
               style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }}
             />
           </div>

           <div className="form-group" style={{ marginBottom: '1.5rem' }}>
             <label>Coach/Evaluators Name</label>
             <input 
               type="text" 
               value={playerInfo.coach}
               onChange={(e) => setPlayerInfo({...playerInfo, coach: e.target.value})}
               placeholder="e.g. Coach Smith"
               style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
             />
           </div>

           <button className="btn-primary" onClick={handlePreFlightReview}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="6 9 6 2 18 2 18 9"></polyline>
               <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
               <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
             Review & Finalize Submission
           </button>
        </div>
        
        {/* NEW: Explicitly rendering Coach Feedback for the Printout Output exclusively */}
        <div className="print-only feedback-print-summary">
          <h2>Coach Feedback & Training Resources</h2>
          {Object.entries(comments).map(([pillar, data]) => {
            if (data.strength.includes('-- Select')) return null;
            return (
              <div className="feedback-row" key={pillar}>
                <b style={{textTransform: 'capitalize', fontSize: '1.1rem'}}>{pillar} Pillar:</b>
                <p><strong>⭐ Strength:</strong> {data.strength}</p>
                <p><strong>📈 Area for Growth:</strong> {data.growth !== '-- Select an Area for Growth --' ? data.growth : 'Not selected.'}</p>
                <p><strong>🏃 Work on your own:</strong> {data.video !== '-- Work on your own --' ? data.video : 'No assignment.'}</p>
              </div>
            )
          })}
          {finalClosingThoughts && (
             <div className="feedback-row" style={{ marginTop: '1.5rem' }}>
                <b style={{fontSize: '1.1rem'}}>Final Coach Assessment:</b>
                <p style={{ fontStyle: 'italic', marginTop: '0.5rem' }}>"{finalClosingThoughts}"</p>
                {playerInfo.coach && (
                  <p style={{ fontWeight: 600, marginTop: '0.5rem', color: 'var(--primary-color)' }}>— Evaluated by: {playerInfo.coach}</p>
                )}
             </div>
          )}
          {!finalClosingThoughts && playerInfo.coach && (
             <div className="feedback-row" style={{ marginTop: '1.5rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--primary-color)' }}>— Evaluated by: {playerInfo.coach}</p>
             </div>
          )}
        </div>
      </div>



      {/* Embedded Glossary Output Appending to Print PDF dynamically */}
      <div className="print-only glossary-page">
         <h1 style={{borderBottom: '2px solid black', paddingBottom: '1rem', marginBottom:'2rem'}}>Evaluation Definitions Glossary</h1>
         {Object.entries(GLOSSARY).map(([term, def]) => (
            <div className="glossary-item" key={term}>
               <b>{term}</b>
               <span>{def}</span>
            </div>
         ))}
      </div>

      {/* Footer */}
      <div className="print-hide" style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '3rem', padding: '1.5rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-color)', opacity: 0.5, fontSize: '0.8rem' }}>
        <p>© {new Date().getFullYear()} Erar Group LLC. All rights reserved. &nbsp;<a href="mailto:erargroup@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>erargroup@gmail.com</a>, &nbsp;<Link to="/director" style={{ color: 'inherit', textDecoration: 'none', letterSpacing: '0.1em' }}>DOS</Link></p>
      </div>
    </>
  );
}
