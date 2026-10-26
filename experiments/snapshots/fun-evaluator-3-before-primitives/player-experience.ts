/**
 * Adapt existing player-report dialects without interpreting their prose.
 * These are source-linked accounts, not sentiment, motivation or behavior scores.
 */
export interface Evidence<T = unknown> {
  sourcePath: string;
  value: T;
}

export type RepetitionJudgment = 'valued' | 'unwanted' | 'neutral' | 'unknown';

export interface NormalizedRepetitionEntry {
  sourcePath: string;
  judgment: RepetitionJudgment;
  changedRole: boolean | null;
  account: unknown;
}

export interface NormalizedExperienceReport {
  experience: Evidence[];
  responses: Evidence[];
  narrative: Evidence[];
  closure: Evidence[];
  renewal: Evidence[];
  forwardWishes: Evidence[];
  repetitions: NormalizedRepetitionEntry[];
  unclassifiedFields: Evidence[];
  explicit: {
    /** A present renewedIntention:null, never an absent key or a prose inference. */
    noRenewedIntention: Evidence<true>[];
    /** A declared boolean or the exact structured state "satisfied closure". */
    satisfiedClosure: Evidence<boolean>[];
    /** Boolean answers only. "Yes, selectively" remains a free-text account. */
    wantsAnother: Evidence<boolean>[];
    /** Reported counts, not independently observed elective actions. */
    optionalActions: Evidence<number>[];
  };
}

type Category = 'experience' | 'responses' | 'narrative' | 'closure' | 'renewal' | 'forwardWishes';

const categories: Readonly<Record<string, Category>> = {
  experience: 'experience',
  experienceSequence: 'experience',
  experienceAcrossTime: 'experience',
  overall: 'experience',
  noticedResponse: 'responses',
  noticedResponses: 'responses',
  worldResponseNoticed: 'responses',
  noticedWorldAndCharacter: 'responses',
  narrative: 'narrative',
  narrativeOrConceptThatMattered: 'narrative',
  narrativeQuestion: 'narrative',
  passageThatMattered: 'narrative',
  meaningfulConceptOrPassage: 'narrative',
  storyAppreciation: 'narrative',
  appreciation: 'narrative',
  closure: 'closure',
  stoppingReason: 'closure',
  reasonForStopping: 'closure',
  actualStoppingReason: 'closure',
  stoppingPoint: 'closure',
  satisfyingClosure: 'closure',
  voluntaryPreferenceReportOnly: 'closure',
  strongestSpans: 'experience',
  weakestSpans: 'experience',
  tacticalAndCreativeChallenge: 'experience',
  philosophicalDifferences: 'experience',
  combinationMeanings: 'experience',
  actualElectiveConstruction: 'experience',
  finalWorld: 'responses',
  ambitionSources: 'renewal',
  continuingQuestions: 'forwardWishes',
  renewedIntention: 'renewal',
  renewal: 'renewal',
  furtherProjectSource: 'renewal',
  adoptedQuestionOrIntention: 'renewal',
  intentionSource: 'renewal',
  suppliedPossibilityVsPersonalPurpose: 'renewal',
  actualCuriosity: 'experience',
  comparisonWithEarlierStop: 'experience',
  comparisonWithQuietClosure: 'experience',
  wantAnother: 'forwardWishes',
  wantToDiscoverNext: 'forwardWishes',
  wantingMore: 'forwardWishes',
  futureWish: 'forwardWishes',
  forwardWish: 'forwardWishes',
  forwardWishes: 'forwardWishes',
};

const repetitionKeys = new Set([
  'repetition', 'repetitionValues', 'repetitionAndAutomation',
  'automaticResolutionLoss', 'automaticResolutionOfSettledCombines', 'meaningfulRepetition',
]);
const dictionaryJudgments = new Set(['valued', 'unwanted', 'neutral', 'unknown']);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const fieldPath = (base: string, key: string): string =>
  /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `${base}.${key}` : `${base}[${JSON.stringify(key)}]`;

function append(target: Evidence[], sourcePath: string, value: unknown): void {
  if (Array.isArray(value) && value.length) {
    value.forEach((item, index) => target.push({ sourcePath: `${sourcePath}[${index}]`, value: item }));
  } else {
    // Null, false, zero and an explicitly empty array must survive normalization.
    target.push({ sourcePath, value });
  }
}

function repetition(sourcePath: string, account: unknown): NormalizedRepetitionEntry {
  const fields = isRecord(account) ? account : {};
  const judgment = typeof fields.judgment === 'string' && dictionaryJudgments.has(fields.judgment)
    ? fields.judgment as RepetitionJudgment : 'unknown';
  return { sourcePath, judgment, changedRole: typeof fields.changedRole === 'boolean' ? fields.changedRole : null, account };
}

/**
 * Source paths refer to the supplied report, beginning with "report.".
 * Multiple accounts are retained, including disagreement. An evidence category
 * identifies the subject of the account; its presence implies no positive value.
 * Unknown fields remain available for review instead of being discarded.
 */
export function normalizeExperienceReport(report: unknown): NormalizedExperienceReport {
  const output: NormalizedExperienceReport = {
    experience: [], responses: [], narrative: [], closure: [], renewal: [],
    forwardWishes: [], repetitions: [], unclassifiedFields: [],
    explicit: { noRenewedIntention: [], satisfiedClosure: [], wantsAnother: [], optionalActions: [] },
  };
  if (!isRecord(report)) {
    if (report !== undefined) output.unclassifiedFields.push({ sourcePath: 'report', value: report });
    return output;
  }

  for (const [key, value] of Object.entries(report)) {
    const sourcePath = fieldPath('report', key);
    if (key === 'episodes' && Array.isArray(value)) {
      append(output.experience, sourcePath, value);
      value.forEach((episode, index) => {
        if (!isRecord(episode)) return;
        for (const responseKey of ['noticedResponse', 'noticedResponses']) {
          if (Object.hasOwn(episode, responseKey)) append(output.responses, `${sourcePath}[${index}].${responseKey}`, episode[responseKey]);
        }
      });
    } else if (key === 'renewedIntentionOrClosure' && typeof value === 'string') {
      // The topic is explicit but its direction remains prose, not a boolean.
      // Preserve it in both accounts for review without claiming either state.
      output.experience.push({ sourcePath, value });
      output.closure.push({ sourcePath, value });
      output.renewal.push({ sourcePath, value });
    } else if (key === 'renewedIntentionOrClosure' && isRecord(value)) {
      // Preserve this account as a whole as well as the explicitly typed parts.
      output.experience.push({ sourcePath, value });
      const satisfied = value.state === 'satisfied closure';
      const renewed = value.state === 'renewed intention';
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        const nestedPath = fieldPath(sourcePath, nestedKey);
        if (nestedKey === 'state' && satisfied) {
          output.closure.push({ sourcePath: nestedPath, value: nestedValue });
          output.explicit.satisfiedClosure.push({ sourcePath: nestedPath, value: true });
        } else if (nestedKey === 'state' && renewed) {
          output.renewal.push({ sourcePath: nestedPath, value: nestedValue });
        } else if (nestedKey === 'intention' && (satisfied || renewed)) {
          append(satisfied ? output.closure : output.renewal, nestedPath, nestedValue);
        } else if (nestedKey === 'reasonForStopping' || nestedKey === 'stoppingReason') {
          append(output.closure, nestedPath, nestedValue);
        } else if (nestedKey === 'optionalActions' && isCount(nestedValue)) {
          output.explicit.optionalActions.push({ sourcePath: nestedPath, value: nestedValue });
        } else {
          // In particular, an ambiguous "intention" is not automatically renewal.
          output.unclassifiedFields.push({ sourcePath: nestedPath, value: nestedValue });
        }
      }
    } else if (repetitionKeys.has(key)) {
      if (key === 'repetition' && Array.isArray(value) && value.length) {
        value.forEach((account, index) => output.repetitions.push(repetition(`${sourcePath}[${index}]`, account)));
      } else if (key === 'repetition' && isRecord(value) && !Object.hasOwn(value, 'judgment')) {
        const entries = Object.entries(value);
        if (!entries.length) output.repetitions.push(repetition(sourcePath, value));
        for (const [heading, account] of entries) {
          if (dictionaryJudgments.has(heading)) {
            // A heading is not an affirmative judgment: valued can say "None".
            output.repetitions.push(repetition(fieldPath(sourcePath, heading), account));
          } else {
            output.unclassifiedFields.push({ sourcePath: fieldPath(sourcePath, heading), value: account });
          }
        }
      } else {
        output.repetitions.push(repetition(sourcePath, value));
      }
    } else if ((key === 'optionalActions' || key === 'optionalCombinations') && isCount(value)) {
      output.explicit.optionalActions.push({ sourcePath, value });
    } else if (key === 'satisfiedClosure' && typeof value === 'boolean') {
      output.closure.push({ sourcePath, value });
      output.explicit.satisfiedClosure.push({ sourcePath, value });
    } else if (Object.hasOwn(categories, key)) {
      append(output[categories[key]], sourcePath, value);
      if (key === 'satisfyingClosure' && isRecord(value) && typeof value.achieved === 'boolean') {
        output.explicit.satisfiedClosure.push({sourcePath: `${sourcePath}.achieved`, value: value.achieved});
      }
      if (key === 'renewedIntention' && value === null) {
        output.explicit.noRenewedIntention.push({ sourcePath, value: true });
      }
      if (key === 'wantAnother') {
        if (typeof value === 'boolean') output.explicit.wantsAnother.push({ sourcePath, value });
        else if (isRecord(value) && typeof value.answer === 'boolean') {
          output.explicit.wantsAnother.push({ sourcePath: `${sourcePath}.answer`, value: value.answer });
        }
      }
    } else {
      output.unclassifiedFields.push({ sourcePath, value });
    }
  }
  return output;
}
