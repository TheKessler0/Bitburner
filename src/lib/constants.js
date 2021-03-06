/**
 * Generic Game Constants
 *
 * Constants for specific mechanics or features will NOT be here.
 */
export const CONSTANTS = {
    VersionString: '1.4.0',
    VersionNumber: 10,
    // Speed (in ms) at which the main loop is updated
    _idleSpeed: 200,
    /** Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
     * and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
     * the player will have this level assuming no multipliers. Multipliers can cause skills to go above this.
     */
    MaxSkillLevel: 975,
    // Milliseconds per game cycle
    MilliPerCycle: 200,
    // How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 200e3,
    // Base RAM costs
    BaseCostFor1GBOfRamHome: 32000,
    BaseCostFor1GBOfRamServer: 55000,
    // Cost to travel to another city
    TravelCost: 200e3,
    // Faction and Company favor-related things
    BaseFavorToDonate: 150,
    DonateMoneyToRepDivisor: 1e6,
    FactionReputationToFavorBase: 500,
    FactionReputationToFavorMult: 1.02,
    CompanyReputationToFavorBase: 500,
    CompanyReputationToFavorMult: 1.02,
    // NeuroFlux Governor Augmentation cost multiplier
    NeuroFluxGovernorLevelMult: 1.14,
    NumNetscriptPorts: 20,
    // Server-related constants
    HomeComputerMaxRam: 1073741824,
    ServerBaseGrowthRate: 1.03,
    ServerMaxGrowthRate: 1.0035,
    ServerFortifyAmount: 0.002,
    ServerWeakenAmount: 0.05,
    PurchasedServerLimit: 25,
    PurchasedServerMaxRam: 1048576,
    // Augmentation Constants
    MultipleAugMultiplier: 1.9,
    // TOR Router
    TorRouterCost: 200e3,
    // Stock market
    WSEAccountCost: 200e6,
    TIXAPICost: 5e9,
    MarketData4SCost: 1e9,
    MarketDataTixApi4SCost: 25e9,
    StockMarketCommission: 100e3,
    // Hospital/Health
    HospitalCostPerHp: 100e3,
    // Intelligence-related constants
    IntelligenceCrimeWeight: 0.025,
    IntelligenceInfiltrationWeight: 0.1,
    IntelligenceCrimeBaseExpGain: 0.05,
    IntelligenceProgramBaseExpGain: 0.1,
    IntelligenceTerminalHackBaseExpGain: 200,
    IntelligenceSingFnBaseExpGain: 1.5,
    IntelligenceClassBaseExpGain: 0.01,
    // Time-related constants
    MillisecondsPer20Hours: 72000000,
    GameCyclesPer20Hours: 72000000 / 200,
    MillisecondsPer10Hours: 36000000,
    GameCyclesPer10Hours: 36000000 / 200,
    MillisecondsPer8Hours: 28800000,
    GameCyclesPer8Hours: 28800000 / 200,
    MillisecondsPer4Hours: 14400000,
    GameCyclesPer4Hours: 14400000 / 200,
    MillisecondsPer2Hours: 7200000,
    GameCyclesPer2Hours: 7200000 / 200,
    MillisecondsPerHour: 3600000,
    GameCyclesPerHour: 3600000 / 200,
    MillisecondsPerHalfHour: 1800000,
    GameCyclesPerHalfHour: 1800000 / 200,
    MillisecondsPerQuarterHour: 900000,
    GameCyclesPerQuarterHour: 900000 / 200,
    MillisecondsPerFiveMinutes: 300000,
    GameCyclesPerFiveMinutes: 300000 / 200,
    // Player Work & Action
    BaseFocusBonus: 0.8,
    FactionWorkHacking: 'Faction Hacking Work',
    FactionWorkField: 'Faction Field Work',
    FactionWorkSecurity: 'Faction Security Work',
    WorkTypeCompany: 'Working for Company',
    WorkTypeCompanyPartTime: 'Working for Company part-time',
    WorkTypeFaction: 'Working for Faction',
    WorkTypeCreateProgram: 'Working on Create a Program',
    WorkTypeStudyClass: 'Studying or Taking a class at university',
    WorkTypeCrime: 'Committing a crime',
    ClassStudyComputerScience: 'studying Computer Science',
    ClassDataStructures: 'taking a Data Structures course',
    ClassNetworks: 'taking a Networks course',
    ClassAlgorithms: 'taking an Algorithms course',
    ClassManagement: 'taking a Management course',
    ClassLeadership: 'taking a Leadership course',
    ClassGymStrength: 'training your strength at a gym',
    ClassGymDefense: 'training your defense at a gym',
    ClassGymDexterity: 'training your dexterity at a gym',
    ClassGymAgility: 'training your agility at a gym',
    ClassDataStructuresBaseCost: 40,
    ClassNetworksBaseCost: 80,
    ClassAlgorithmsBaseCost: 320,
    ClassManagementBaseCost: 160,
    ClassLeadershipBaseCost: 320,
    ClassGymBaseCost: 120,
    ClassStudyComputerScienceBaseExp: 0.5,
    ClassDataStructuresBaseExp: 1,
    ClassNetworksBaseExp: 2,
    ClassAlgorithmsBaseExp: 4,
    ClassManagementBaseExp: 2,
    ClassLeadershipBaseExp: 4,
    CrimeShoplift: 'shoplift',
    CrimeRobStore: 'rob a store',
    CrimeMug: 'mug someone',
    CrimeLarceny: 'commit larceny',
    CrimeDrugs: 'deal drugs',
    CrimeBondForgery: 'forge corporate bonds',
    CrimeTraffickArms: 'traffick illegal arms',
    CrimeHomicide: 'commit homicide',
    CrimeGrandTheftAuto: 'commit grand theft auto',
    CrimeKidnap: 'kidnap someone for ransom',
    CrimeAssassination: 'assassinate a high-profile target',
    CrimeHeist: 'pull off the ultimate heist',
    // Coding Contract
    // TODO: Move this into Coding contract implementation?
    CodingContractBaseFactionRepGain: 2500,
    CodingContractBaseCompanyRepGain: 4000,
    CodingContractBaseMoneyGain: 75e6,
    // BitNode/Source-File related stuff
    TotalNumBitNodes: 24,
    LatestUpdate: `
    v1.4.0 - 2022-01-18 Sharing is caring
    -------------------------------------

    ** Computer sharing **

    * A new mechanic has been added, it's is invoked by calling the new function 'share'.
      This mechanic helps you farm reputation faster.

    ** gang **

    * Installing augs means losing a little bit of ascension multipliers.

    ** There's more but I'm going to write it later. **

    ** Misc. **

    * Nerf noodle bar.
`,
};
