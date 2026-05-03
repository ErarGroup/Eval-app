import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
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

const PRESET_COMMENTS = {
  mindset: [
    "-- Select a Coach Comment --", 
    "Excellent focus and coachability", 
    "Needs to stay calm under pressure", 
    "Great team leader on the field", 
    "Must improve reaction to mistakes",
    "Consistently displays a positive attitude",
    "Shows great determination in 50/50 challenges",
    "Needs to improve communication with teammates"
  ],
  physical: [
    "-- Select a Coach Comment --", 
    "Incredible stamina throughout the match", 
    "Needs extra fitness conditioning", 
    "Great speed and explosiveness", 
    "Improve agility drills and foot speed",
    "Strong body presence on the field",
    "Requires better reaction time to loose balls",
    "Excellent coordination and balance"
  ],
  technical: [
    "-- Select a Coach Comment --", 
    "Fantastic ball control in tight spaces", 
    "Needs to practice weaker foot passing", 
    "Great shooting accuracy", 
    "Work on shielding the ball better",
    "Excellent first touch when receiving",
    "Improve dribbling past defenders at pace",
    "Consistent and accurate passing range"
  ],
  tactical: [
    "-- Select a Coach Comment --", 
    "Excellent spatial awareness", 
    "Needs to drop back faster on defense", 
    "Great offensive overlapping runs", 
    "Work on positioning without the ball",
    "Smart decision making in the final third",
    "Needs better anticipation of opponent movements",
    "Quick transition from attack to defense"
  ]
};

const PRESET_VIDEOS = {
  mindset: [
    "-- Recommend Training Video --", 
    "https://youtube.com/watch?v=mindset1 (Focus Drill)", 
    "https://youtube.com/watch?v=mindset2 (Handling Pressure)",
    "https://youtube.com/watch?v=mindset3 (Leadership on the Pitch)",
    "https://youtube.com/watch?v=mindset4 (Overcoming Mistakes)",
    "https://youtube.com/watch?v=mindset5 (Aggressive Mentality)",
    "https://youtube.com/watch?v=mindset6 (Communication Exercises)",
    "https://youtube.com/watch?v=mindset7 (Building Confidence)"
  ],
  physical: [
    "-- Work on your own --", 
    "Agility Ladder", 
    "Stamina Drills",
    "Sprint Mechanics",
    "Core Strength for Soccer",
    "Reaction Speed Training",
    "Plyometric Explosiveness",
    "Balance & Coordination"
  ],
  technical: [
    "-- Work on your own --", 
    "Wall Passing", 
    "Ball Mastery",
    "Shooting Technique",
    "Shielding the ball better",
    "Weak Foot Development",
    "First Touch Control",
    "1v1 Dribbling Moves",
    "Long range pass",
    "Shielding the Ball"
  ],
  tactical: [
    "-- Work on your own --", 
    "Scanning the field",
    "Defensive Positioning", 
    "Attacking Runs",
    "Spatial Awareness",
    "Off-the-ball Movement",
    "Counter Attacking Speed",
    "Pressing Triggers",
    "Playing out of the Back"
  ]
};

export default function App() {
  const [playerInfo, setPlayerInfo] = useState({
    program: [] as string[], name: '', age: '', team: '', date: new Date().toISOString().split('T')[0], coach: '', emails: [] as string[]
  });

  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState({
    mindset: { text: '-- Select a Coach Comment --', video: '-- Recommend Training Video --' },
    physical: { text: '-- Select a Coach Comment --', video: '-- Work on your own --' },
    technical: { text: '-- Select a Coach Comment --', video: '-- Work on your own --' },
    tactical: { text: '-- Select a Coach Comment --', video: '-- Work on your own --' }
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
  }, []);

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
       if (obj.text.includes('-- Select')) {
         alert(`Missing Coach Comment in your ${pillar.toUpperCase()} section.`);
         return;
       }
       if (pillar !== 'mindset' && obj.video.includes('-- Work on your own --')) {
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
          <label>Coach's Comment: <span style={{color: 'red'}}>*</span></label>
          <select 
             value={comments[objKey as keyof typeof comments].text}
             onChange={e => setComments(prev => ({ ...prev, [objKey]: { ...prev[objKey as keyof typeof comments], text: e.target.value } }))}
             style={{ borderColor: comments[objKey as keyof typeof comments].text.includes('--') ? 'rgba(239, 68, 68, 0.4)' : '' }}
          >
            {PRESET_COMMENTS[objKey as keyof typeof PRESET_COMMENTS].map(opt => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        {objKey !== 'mindset' && (
          <div className="form-group">
            <label>Work on your own: <span style={{color: 'red'}}>*</span></label>
            <select 
               value={comments[objKey as keyof typeof comments].video}
               onChange={e => setComments(prev => ({ ...prev, [objKey]: { ...prev[objKey as keyof typeof comments], video: e.target.value } }))}
               style={{ borderColor: comments[objKey as keyof typeof comments].video.includes('--') ? 'rgba(239, 68, 68, 0.4)' : '' }}
            >
              {PRESET_VIDEOS[objKey as keyof typeof PRESET_VIDEOS].map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        )}
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
          <Link to="/director" className="rating-btn print-hide" style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', textDecoration: 'none' }}>
             Director Dashboard → 
          </Link>
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
                   {availableTeams.map(team => <option key={team} value={team}>{team}</option>)}
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
                   {availableAges.map(age => <option key={age} value={age}>{age}</option>)}
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
                   {availableNames.map(name => <option key={name} value={name}>{name}</option>)}
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
            if (data.text.includes('-- Select')) return null;
            return (
              <div className="feedback-row" key={pillar}>
                <b style={{textTransform: 'capitalize', fontSize: '1.1rem'}}>{pillar} Pillar:</b>
                <p><strong>Coach Note:</strong> {data.text}</p>
                {pillar !== 'mindset' && (
                  <p><strong>Work on your own:</strong> {data.video !== '-- Work on your own --' ? data.video : 'No assignment.'}</p>
                )}
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
    </>
  );
}
