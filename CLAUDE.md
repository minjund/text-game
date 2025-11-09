# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Kingdom Wars" is a text-based kingdom management strategy game where players take the role of a god who becomes human to conquer the Akasha Empire within 42 real-time days. Built with Nuxt 4, Vue 3, and TypeScript, the game features kingdom management, general recruitment, turn-based combat, card collection systems, and meta-progression through reincarnation.

## Development Commands

All commands run from `nuxt-app/` directory:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site (client-only SPA)
npm run generate
```

## Architecture

### Framework & Tech Stack

- **Nuxt 4.1.3**: SSR disabled (`ssr: false`) - client-only SPA for game state management
- **Vue 3.5.22**: Composition API with `<script setup>` syntax throughout
- **TypeScript**: Full type coverage with auto-generated Nuxt types
- **Tailwind CSS**: Styling with custom glassmorphism effects
- **Phaser 3.90.0**: 2D game framework for battle animations
- **Three.js/TresJS**: 3D graphics library with Vue integration
- **localStorage**: Primary persistence layer for all game state

### Core Game Systems

The game is structured around **16 composables** that manage distinct game systems:

#### State Management Pattern

All game state is managed through composables that accept refs and callback functions as parameters. This creates a dependency injection pattern where the main `game.vue` orchestrates all systems:

```typescript
// Example: game.vue coordinates all composables
const { kingdom, empire, recruitSoldiers, calculateProduction } =
  useGameKingdom(godGameState, permanentEffects, showNotification)

const { generals, recruitGeneral, dismissGeneral } =
  useGameGenerals(kingdom, showNotification)
```

**Key Composables:**

- `useGameKingdom`: Core kingdom state (resources, production calculations, empire tracking)
- `useGameReincarnation`: Meta-progression system - loads/saves inherited cards and bonuses across game runs
- `useRealTimeGameTimer`: 42-day countdown timer with weekly invasion tracking (7-day intervals)
- `useTurnSystem`: Turn-based actions with auto-regeneration
- `useBattleSystem`: Text-based narrative combat with generals, skills, and battle logs
- `useGamePassiveCards`: Passive card triggers (daily/battle_start/battle_win/battle_lose/recruit)
- `useSynergyCards`: Card combo system with tag-based bonuses (trade/military/agriculture/culture)
- `useEventSystem`: Random story events with choice consequences
- `useGodGame`: Commandment system - 5 divine laws affect starting stats and gameplay
- `useTutorial`: Progressive feature unlocking and advisor notifications
- `useGeneralGenerator`: Procedural general creation with randomized stats/skills/rarities

#### Data Flow: localStorage Persistence

Critical localStorage keys:
- `gameStartTime`: Real-time start timestamp for 42-day timer
- `invasionTracker`: JSON object tracking which weeks had empire invasions (`{1: true, 2: false, ...}`)
- `reincarnationData`: Carries forward `count`, `inheritedCards[]`, `totalDaysPlayed`, `bonuses[]`
- `godGameState`: Stores nation name and commandment effects from story mode
- `gameData`: Current kingdom state snapshot
- `playerName`, `kingdomName`: User-defined names
- `tutorialProgress`: Which features are unlocked and advisor messages seen

**Important:** Always check `process.client` before accessing localStorage. Nuxt runs code on both server and client during build, even with `ssr: false`.

### Project Structure

```
nuxt-app/app/
├── pages/
│   ├── index.vue          # Landing/marketing page
│   ├── story.vue          # Tutorial narrative + commandment selection
│   └── game.vue           # Main game orchestrator (~800 lines, imports all systems)
│
├── components/
│   ├── game/              # 40+ game-specific UI components
│   │   ├── GameGeneralsModal.vue
│   │   ├── GameBattleModal.vue
│   │   ├── GameEventModal.vue
│   │   ├── GamePassiveCardsModal.vue
│   │   ├── GameSynergyGuide.vue
│   │   ├── GameCommandmentsModal.vue
│   │   ├── GameDailyCardExchange.vue
│   │   └── ... (modals, panels, displays)
│   └── ui/                # Generic reusable components
│
├── composables/           # 16 game logic composables (see above)
│
├── types/
│   ├── game.ts            # Kingdom, General, Battle, EventCard, Skill
│   ├── passive-cards.ts   # PassiveCard, PassiveTrigger, SynergyTag, SYNERGY_EFFECTS
│   ├── synergy-cards.ts   # SynergyCard, SynergyBonus, SYNERGY_CARDS (10 predefined)
│   ├── god-game.ts        # Commandment, NationState, AVAILABLE_COMMANDMENTS (12 laws)
│   └── reincarnation.ts   # ReincarnationData, bonus calculation helpers
│
└── data/
    ├── tutorialStory.ts   # 10+ story chapters with typewriter narrative
    └── mockData.ts        # Sample generals, kingdoms, skills for testing
```

### Game Flow Architecture

1. **Landing** (`index.vue`) → User clicks "Start Game"
2. **Story Mode** (`story.vue`):
   - Typewriter narrative with 10+ chapters
   - Player inputs nation name
   - Selects 5 commandments from 12 available (with reroll option)
   - Commandments modify starting resources (`godGameState`)
   - Saves to localStorage and navigates to `/game`
3. **Start Card Selection**:
   - First-time players see modal to choose 9 passive cards
   - Uses `tutorialState.hasSelectedStartCards` flag
4. **Main Game Loop** (`game.vue`):
   - **Turn System**: Actions cost turn points, auto-regenerate over time
   - **Daily Progression**: "Next Day" button triggers:
     - Resource production via `calculateProduction()`
     - 30% chance: Daily card exchange (3 new random cards)
     - 70% chance: Story event with choices affecting resources
     - Every 25 days: Synergy card selection
     - Passive card triggers with `trigger: 'daily'`
   - **Real-Time Invasions**:
     - `useRealTimeGameTimer` tracks elapsed days since `gameStartTime`
     - Every 7 real-time days (weeks 1-6): Empire invasion if not already occurred
     - Uses `invasionTracker` to prevent duplicate invasions
   - **Battle System**:
     - Player selects generals, assigns soldiers
     - Text-based narrative combat logs with skill effects
     - Passive cards trigger on `battle_start`, `battle_win`, `battle_lose`
   - **Reincarnation**:
     - At day 42 or when empire defeated
     - Select 1 passive card to inherit permanently
     - `inheritedCards[]` accumulates across all runs
     - Bonuses scale with reincarnation count

### Type System Highlights

**General System:**
```typescript
interface General {
  id: string
  name: string
  title: string
  rarity: 'common' | 'rare' | 'epic'
  stats: { power: number, intelligence: number, leadership: number }
  skills: Skill[]  // Array of combat abilities
  assignedSoldiers: number  // Combat effectiveness multiplier
}
```

**Passive Card Triggers:**
- `'daily'`: Fires when "Next Day" button clicked
- `'battle_start'`: Fires when battle modal opens
- `'battle_win'` / `'battle_lose'`: Fires based on battle result
- `'recruit'`: Fires when recruiting soldiers

**Synergy System:**
Cards have `synergyTags: SynergyTag[]` where tags are `'trade' | 'military' | 'agriculture' | 'culture'`. The `useSynergyCards` composable counts matching tags and applies bonuses defined in `SYNERGY_EFFECTS` (e.g., 3 trade cards = +300 gold/day, +2 morale).

### Nuxt Configuration Notes

- **SSR disabled** (`ssr: false`): Game state relies on client-side localStorage
- **Vite optimization**: Phaser loaded client-side only via `optimizeDeps.include`
- **HMR tunneling**: Configured for ngrok development (`allowedHosts`, `HMR_PORT`, `HMR_PROTOCOL` env vars)
- **Modules**: `@tresjs/nuxt` (Three.js), `@nuxtjs/tailwindcss`

## Common Development Patterns

### Adding a New Game System

1. Create composable in `composables/use[SystemName].ts`
2. Define types in `types/[system-name].ts`
3. Import and call composable in `game.vue`, passing required refs
4. Add UI components to `components/game/`
5. Update localStorage keys if persisting state

### Adding New Cards

**Passive Cards:**
Edit `types/passive-cards.ts` to add card definitions with proper trigger and effects.

**Synergy Cards:**
Edit `types/synergy-cards.ts` - only 10 cards exist (3 trade, 3 military, 2 agriculture, 2 culture). Adding more requires updating combo logic.

### Modifying Commandments

Edit `AVAILABLE_COMMANDMENTS` in `types/god-game.ts`. Each commandment has:
- `effects`: Modifies starting `{ morale, gold, military, food, population }`
- `pros`/`cons`: Display arrays for player decision-making

### Working with Battle System

Battle logs use `BattleLog` interface with optional narrative fields:
```typescript
interface BattleLog {
  turn: number
  generalName: string
  action: string
  success: boolean
  message: string
  story?: string       // Narrative description
  speaker?: string     // Character name
  dialogue?: string    // Character dialogue
  narrativeType?: 'action' | 'dialogue' | 'narration'
}
```

Battles are fully text-based - no Phaser canvas currently implemented (Phaser imported but unused).

### Tutorial System

`useTutorial` composable manages:
- `tutorialState.unlockedFeatures`: Object with feature flags (`{ generals: boolean, battle: boolean, ... }`)
- `advisorMessages`: Queue of notification messages with optional rewards
- Features unlock progressively based on game day and actions

Always check `tutorialState.unlockedFeatures.[feature]` before rendering UI elements.

## Important Implementation Details

### Real-Time vs Turn-Based Hybrid

- **Real-time timer**: 42-day countdown runs continuously based on `gameStartTime`
- **Turn-based actions**: Player actions cost turn points that regenerate over time
- **Weekly invasions**: Trigger at 7-day intervals (real-time), not game days
- **Game days**: Incremented manually via "Next Day" button, not real-time

### Reincarnation Meta-Progression

The `reincarnationData` object persists across browser sessions and accumulates:
- `inheritedCards[]`: All cards selected across all runs (not just last one)
- `bonuses[]`: Calculated via `calculateReincarnationBonuses(count)` - scales with run count
- Starting resources = base + godGameState + reincarnation bonuses

When resetting game via `resetGameKeepProgress()`, preserve:
- Nation name and ruler name
- All `inheritedCards[]`
- Commandment effects from `godGameState`

### Resource Calculation with Effects

Production formulas apply permanent effects from crossroads and bonuses:
```typescript
// Example from useGameKingdom
const baseFoodProduction = Math.floor(kingdom.value.resources.morale * 10)
const foodBonus = permanentEffects.value.reduce((sum, e) => sum + (e.value?.foodBonus || 0), 0)
const finalProduction = Math.floor(baseFoodProduction * (1 + foodBonus / 100))
```

Always iterate through `permanentEffects` array when calculating resource changes.

### Mobile vs Desktop Layouts

The game has completely separate component trees for mobile and desktop:
- Desktop: `GameDesktopHeader` + `GameLeftSidebar` + `GameActionPanel`
- Mobile: `GameMobileResources` (fixed top) + `GameMobileActions` (fixed bottom)

Use Tailwind responsive classes (`md:hidden`, `hidden md:flex`) to toggle layouts.