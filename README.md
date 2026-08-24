DileBean

I am stepping away from personal side-projects and releasing DileBean as open-source. If you would like to take over, finish the remaining roadmap, or maintain it, please reach out at patrikdecky@patrikdecky.com.

What is DileBean?
DileBean replaces cold coffee tracking databases with a tactile, real-world Barista Kitchen spatial interface. Instead of clinical forms, your workstation is split into physical environments:
- The Counter: Active brew setups (Bean, Brewer, Grinder, Recipe) and daily brew logs.
- The Cupboard: Reserve coffee bag inventory and stored brewing hardware.
- The Cookbook: Method-decoupled, ratio-driven recipe engine.
- Settings: App configuration and data management.

Architecture
- Domain Model (types.ts): Complete schema for Bags, Brewers, Grinders, Base Recipes, Active Brews, and Evaluations.
- Recommendation Engine (brain.tsx): Analyzes historical sensory evaluations, roast levels, and brewer categories to calculate target dose, water temp, and physical grinder click deltas.
- Physical Grinder Mapping: Relative percentage scale mapped to physical grinder min/max click ranges and step increments.
- Interactive Modals and Guides: In-app reference guides for cupping evaluations, roast profiles, and grinder setup.

Getting Started
The root of the frontend application is located at /frontend. To run the app, navigate to that directory first:
cd frontend
npm install
npm run dev

License
Distributed under the GNU General Public License v3.0 (GPLv3). See LICENSE file for details.