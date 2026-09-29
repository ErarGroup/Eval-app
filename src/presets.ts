export const PRESET_STRENGTHS: Record<string, { advanced: string[], intermediate: string[], basic: string[] }> = {
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

export const PRESET_GROWTH: Record<string, { advanced: string[], intermediate: string[], basic: string[] }> = {
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

export const PRESET_VIDEOS: Record<string, { advanced: { strength: string[], growth: string[] }, intermediate: { strength: string[], growth: string[] }, basic: { strength: string[], growth: string[] } }> = {
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
