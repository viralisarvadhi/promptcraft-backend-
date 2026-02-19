import { EvaluationResult, Grade, ChallengeAttributes } from '../types';

export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function getGrade(totalScore: number): Grade {
    if (totalScore >= 9.0) return 'S';
    if (totalScore >= 8.0) return 'A';
    if (totalScore >= 6.5) return 'B';
    if (totalScore >= 5.0) return 'C';
    if (totalScore >= 3.0) return 'D';
    return 'F';
}

export function heuristicEvaluate(
    promptText: string,
    challenge: ChallengeAttributes
): EvaluationResult {
    const wordCount = countWords(promptText);

    // Clarity Score (0-2): Based on length and readability
    let clarityScore = 0;
    if (wordCount >= 20) clarityScore += 0.5;
    if (wordCount >= 50) clarityScore += 0.5;
    if (wordCount >= 100) clarityScore += 0.5;
    if (!promptText.match(/\b(um|uh|like|maybe|perhaps)\b/gi)) clarityScore += 0.5;

    // Specificity Score (0-2): Technical terms and details
    let specificityScore = 0;
    const technicalTerms = promptText.match(/\b(API|database|function|component|class|interface|endpoint|schema|model|service|authentication|authorization|validation|error|response|request|data|user|admin|role|permission)\b/gi);
    if (technicalTerms && technicalTerms.length >= 3) specificityScore += 0.5;
    if (technicalTerms && technicalTerms.length >= 6) specificityScore += 0.5;
    if (technicalTerms && technicalTerms.length >= 10) specificityScore += 0.5;

    const hasNumbers = /\d+/.test(promptText);
    if (hasNumbers) specificityScore += 0.5;

    // Context Score (0-2): Background information and use case
    let contextScore = 0;
    const contextKeywords = promptText.match(/\b(for|because|since|in order to|purpose|goal|objective|requirement|need|should|must|user|customer|client|scenario|case|example)\b/gi);
    if (contextKeywords && contextKeywords.length >= 2) contextScore += 0.5;
    if (contextKeywords && contextKeywords.length >= 4) contextScore += 0.5;
    if (contextKeywords && contextKeywords.length >= 6) contextScore += 0.5;
    if (wordCount >= 80) contextScore += 0.5;

    // Structure Score (0-2): Organization and formatting
    let structureScore = 0;
    const hasListMarkers = /(\n[-*•]|\n\d+\.|\n[a-z]\))/.test(promptText);
    if (hasListMarkers) structureScore += 0.5;

    const hasSections = promptText.split('\n\n').length >= 2;
    if (hasSections) structureScore += 0.5;

    const sentences = promptText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 3) structureScore += 0.5;
    if (sentences.length >= 5) structureScore += 0.5;

    // Completeness Score (0-2): Coverage of challenge tips
    let completenessScore = 0;
    const lowerPrompt = promptText.toLowerCase();
    let tipsCovered = 0;

    challenge.tips.forEach(tip => {
        const tipKeywords = tip.toLowerCase().match(/\b\w{4,}\b/g) || [];
        const covered = tipKeywords.some(keyword => lowerPrompt.includes(keyword));
        if (covered) tipsCovered++;
    });

    const coverageRatio = challenge.tips.length > 0 ? tipsCovered / challenge.tips.length : 0;
    if (coverageRatio >= 0.25) completenessScore += 0.5;
    if (coverageRatio >= 0.5) completenessScore += 0.5;
    if (coverageRatio >= 0.75) completenessScore += 0.5;
    if (coverageRatio >= 1.0) completenessScore += 0.5;

    // Cap scores at 2.0
    clarityScore = Math.min(clarityScore, 2.0);
    specificityScore = Math.min(specificityScore, 2.0);
    contextScore = Math.min(contextScore, 2.0);
    structureScore = Math.min(structureScore, 2.0);
    completenessScore = Math.min(completenessScore, 2.0);

    const totalScore = parseFloat(
        (clarityScore + specificityScore + contextScore + structureScore + completenessScore).toFixed(2)
    );
    const grade = getGrade(totalScore);

    // Generate suggestions
    const suggestions: string[] = [];
    if (clarityScore < 1.5) suggestions.push('Add more detail and avoid vague language');
    if (specificityScore < 1.5) suggestions.push('Include more technical terms and specific requirements');
    if (contextScore < 1.5) suggestions.push('Provide more background context and use case information');
    if (structureScore < 1.5) suggestions.push('Organize your prompt with clear sections or bullet points');
    if (completenessScore < 1.5) suggestions.push('Address more of the challenge hints in your prompt');

    // Generate strengths
    const strengths: string[] = [];
    if (clarityScore >= 1.5) strengths.push('Clear and well-articulated prompt');
    if (specificityScore >= 1.5) strengths.push('Good use of technical terminology');
    if (contextScore >= 1.5) strengths.push('Strong contextual information provided');
    if (structureScore >= 1.5) strengths.push('Well-structured and organized');
    if (completenessScore >= 1.5) strengths.push('Comprehensive coverage of requirements');

    return {
        totalScore,
        grade,
        clarityScore,
        specificityScore,
        contextScore,
        structureScore,
        completenessScore,
        suggestions: suggestions.slice(0, 5),
        strengths: strengths.slice(0, 3),
        evaluatorType: 'heuristic',
        wordCount,
    };
}
