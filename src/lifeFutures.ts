export type Future = {description: string, value: number}

export const lifeFutures: Future[] = [
    // Career
    { description: "You get promoted to team lead at work.", value: 10 },
    { description: "Your project fails, and you must start over.", value: -6 },
    { description: "You get invited to a prestigious industry conference.", value: 8 },
    { description: "You get laid off unexpectedly.", value: -10 },

    // Relationships
    { description: "You make a new close friend.", value: 7 },
    { description: "A friendship ends after a disagreement.", value: -5 },
    { description: "You start dating someone special.", value: 9 },
    { description: "You go through a painful breakup.", value: -8 },

    // Health & Lifestyle
    { description: "You start a fitness routine and feel energized.", value: 6 },
    { description: "You catch a minor illness that slows you down.", value: -3 },
    { description: "You complete a marathon or big physical challenge.", value: 8 },
    { description: "You suffer a small injury and need rest.", value: -4 },

    // Finance
    { description: "You save a significant amount for future goals.", value: 7 },
    { description: "Unexpected expenses deplete your savings.", value: -6 },
    { description: "You make a successful investment.", value: 9 },
    { description: "You lose money in a failed investment.", value: -9 },

    // Personal growth / experiences
    { description: "You travel to a country you’ve always wanted to visit.", value: 8 },
    { description: "You learn a new skill that opens opportunities.", value: 7 },
    { description: "You experience a stressful challenge that shakes your confidence.", value: -5 },
    { description: "You reconnect with someone from your past, bringing joy.", value: 6 },
];
