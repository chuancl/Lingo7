
export type AppView = 'dashboard' | 'words' | 'settings';
export type SettingSectionId = 'general' | 'visual-styles' | 'scenarios' | 'word-bubble' | 'page-widget' | 'engines' | 'preview' | 'anki';

export enum WordCategory {
  WantToLearnWord = 'wantToLearn',
  LearningWord = 'learning',
  KnownWord = 'known'
}

export type WordTab = 'all' | WordCategory;

export interface Scenario {
  id: string;
  name: string;
  isActive: boolean;
  isCustom: boolean;
}

export interface PhraseItem {
    text: string;
    trans: string;
}

export interface SynonymItem {
    text: string;
    trans: string;
}

export interface RootItem {
    root: string;
    words: { text: string; trans: string }[];
}

export interface VideoItem {
    title: string;
    url: string;
    cover?: string;
}

export interface WordEntry {
  id: string;
  text: string;
  translation: string;
  englishDefinition?: string;
  category: WordCategory;
  addedAt: number;
  scenarioId: string;
  
  // Phonetics
  phoneticUs?: string;
  phoneticUk?: string;

  // Metadata
  partOfSpeech?: string;
  tags?: string[];
  importance?: number; // 0-5
  cocaRank?: number;

  // Context & Examples
  contextSentence?: string;
  contextSentenceTranslation?: string;
  mixedSentence?: string;
  dictionaryExample?: string;
  dictionaryExampleTranslation?: string;
  
  // Captured Context (for Anki/Learning)
  contextParagraph?: string;
  contextParagraphTranslation?: string;
  mixedParagraph?: string;
  sourceUrl?: string;
  sourceTimestamp?: number;

  // Rich Info
  inflections?: string[];
  phrases?: PhraseItem[];
  roots?: RootItem[];
  synonyms?: SynonymItem[];
  image?: string;
  video?: VideoItem;
}

export interface StyleConfig {
  color: string;
  backgroundColor: string;
  isBold: boolean;
  isItalic: boolean;
  underlineStyle: string;
  underlineColor: string;
  underlineOffset: string;
  fontSize: string;
  densityMode: 'count' | 'percent';
  densityValue: number;
}

export interface LayoutWrapperConfig {
    prefix: string;
    suffix: string;
}

export interface LayoutSpecificConfig {
    translationFirst: boolean;
    wrappers: {
        translation: LayoutWrapperConfig;
        original: LayoutWrapperConfig;
    };
    baselineTarget?: 'translation' | 'original';
}

export interface OriginalTextConfig {
  show: boolean;
  style: StyleConfig;
  activeMode: 'horizontal' | 'vertical';
  horizontal: LayoutSpecificConfig;
  vertical: LayoutSpecificConfig;
}

export interface PageWidgetConfig {
  enabled: boolean;
  x: number;
  y: number;
  width?: number;
  maxHeight?: number;
  opacity?: number;
  backgroundColor?: string;
  fontSize?: string;

  modalPosition: { x: number, y: number };
  modalSize: { width: number, height: number };

  showPhonetic: boolean;
  showMeaning: boolean;
  showMultiExamples: boolean;
  showExampleTranslation: boolean;
  showContextTranslation: boolean;
  showInflections: boolean;
  showPartOfSpeech: boolean;
  showTags: boolean;
  showImportance: boolean;
  showCocaRank: boolean;

  showSections: {
    known: boolean;
    want: boolean;
    learning: boolean;
  };
  cardDisplay: { id: string, label: string, enabled: boolean }[];
}

export type ModifierKey = 'None' | 'Alt' | 'Ctrl' | 'Shift' | 'Meta';
export type MouseAction = 'Hover' | 'Click' | 'DoubleClick' | 'RightClick';
export type BubblePosition = 'top' | 'bottom' | 'left' | 'right';

export interface InteractionTrigger {
    modifier: ModifierKey;
    action: MouseAction;
    delay: number;
}

export interface WordInteractionConfig {
  mainTrigger: InteractionTrigger;
  quickAddTrigger: InteractionTrigger;
  bubblePosition: BubblePosition;
  showPhonetic: boolean;
  showOriginalText: boolean;
  showDictExample: boolean;
  showDictTranslation: boolean;
  autoPronounce: boolean;
  autoPronounceAccent: 'US' | 'UK';
  autoPronounceCount: number;
  dismissDelay: number;
  allowMultipleBubbles: boolean;
}

export interface AutoTranslateConfig {
  enabled: boolean;
  bilingualMode: boolean;
  translateWholePage: boolean;
  matchInflections: boolean;
  aggressiveMode: boolean;
  blacklist: string[];
  whitelist: string[];
  ttsSpeed: number;
}

export type EngineType = 'standard' | 'ai';

export interface TranslationEngine {
  id: string;
  name: string;
  type: EngineType;
  isEnabled: boolean;
  isCustom: boolean;
  apiKey?: string;
  endpoint?: string;
  model?: string;
  appId?: string;
  secretKey?: string; 
  region?: string;
  projectId?: number;
  isTesting?: boolean;
  testResult?: 'success' | 'fail' | null;
  testErrorMessage?: string;
}

export interface DictionaryEngine {
    id: string;
    name: string;
    link: string;
    description: string;
    isEnabled: boolean;
    priority: number;
}

export interface AnkiConfig {
  enabled: boolean;
  url: string;
  deckNameWant: string;
  deckNameLearning: string;
  modelName: string;
  syncInterval: number;
  autoSync: boolean;
  syncScope: { wantToLearn: boolean, learning: boolean };
  templates: { frontTemplate: string, backTemplate: string };
}

export interface MergeStrategyConfig {
  strategy: 'by_word' | 'by_word_and_meaning';
  showMultiExamples: boolean;
  showExampleTranslation: boolean;
  showContextTranslation: boolean;
  showPartOfSpeech: boolean;
  showTags: boolean;
  showImportance: boolean;
  showCocaRank: boolean;
  showImage: boolean;
  showVideo: boolean;
  exampleOrder: { id: string, label: string, enabled: boolean }[];
}

export interface DictionaryMeaningCard {
    partOfSpeech: string;
    defCn: string;
    defEn: string;
    inflections: string[];
    tags: string[];
    importance: number;
    cocaRank: number;
    example: string;
    exampleTrans: string;
    // UI state
    isSelected?: boolean;
    selectedImage?: string | null;
}

export interface RichDictionaryResult {
    text: string;
    phoneticUs: string;
    phoneticUk: string;
    inflections: string[];
    phrases: PhraseItem[];
    roots: RootItem[];
    synonyms: SynonymItem[];
    images: string[];
    video?: VideoItem;
    
    meanings: DictionaryMeaningCard[];
    expandEcMeanings: DictionaryMeaningCard[];
    ecMeanings: DictionaryMeaningCard[];
    source: 'collins' | 'expand_ec' | 'ec';
}
