# Speech Therapy Companion Application

A specialized web application designed to help speech therapists engage with children who have Down syndrome, specifically tailored for a 12-year-old girl with an IQ of 55. The application leverages the patient's special interests in dragons and dinosaurs, along with her color preferences (pink, purple, white) to create a highly engaging therapy environment.

## Core Purpose

This application serves as a powerful tool during therapy sessions to:
- Maintain engagement throughout 45-minute sessions
- Prevent disengagement behaviors (lying down, putting legs up, running away)
- Support speech intelligibility goals through motivating activities
- Manage transitions between therapy activities smoothly
- Leverage special interests and color preferences

## Key Features

### Session Management Tools
- **Visual Session Timer**: Dragon-themed visual timer showing the full 45-minute session
- **Activity Sequencer**: Manages transitions between activities with animated dragon/dinosaur guide
- **Progress Tracker**: Tracks session progress and token economy with dragon gems/eggs
- **Session Configurator**: Allows therapists to customize sessions with speech targets and behavior focus

### Therapeutic Activity Modules
- **Dragon Speech Quest**: Speech practice with dragon power-up mechanics
- **Expert Role-Play**: Patient as expert teaching the therapist
- **Movement-Based Activities**: Physical movement combined with speech practice

### Behavior Support Features
- **Visual Boundary System**: Visual cues for therapy space boundaries
- **Token Economy Visualizer**: Visual token economy for reinforcement
- **Dragon's Den**: Calming space for structured breaks
- **Behavior Momentum Builder**: Quick-win sequence for rebuilding engagement

### OpenAI Content Generation
- **Content Prompt Builder**: Creates customized prompts for content generation
- **Content Adapter**: Adapts content for cognitive accessibility
- **Visual Support Generator**: Creates visual supports for key concepts
- **OpenAI Service**: Handles API integration with OpenAI

## Technology Stack

- **Next.js**: React framework for production
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **OpenAI API**: Content generation

## Getting Started

See the [Installation Guide](./docs/installation_guide.md) for detailed setup instructions.

### Quick Start

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Documentation

- [User Manual](./docs/user_manual.md): Comprehensive guide for therapists
- [Installation Guide](./docs/installation_guide.md): Setup and configuration instructions
- [Technical Documentation](./docs/technical_documentation.md): Architecture and development details

## Project Structure

```
speech_therapy_app_implementation/
├── docs/                      # Documentation
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js pages
│   ├── components/            # React components
│   │   ├── activity-modules/  # Therapeutic activity components
│   │   ├── behavior-support/  # Behavior support components
│   │   ├── openai-content/    # OpenAI content generation components
│   │   └── session-management/# Session management components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── styles/                # Global styles
│   └── types/                 # TypeScript type definitions
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore file
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
├── README.md                 # Project documentation
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For support or inquiries, please contact:
- Email: support@speechtherapycompanion.app
- Website: https://speechtherapycompanion.app

---

© 2025 Speech Therapy Companion Application
Version 1.0
