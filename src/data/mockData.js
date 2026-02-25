export const lessons = [
    {
        id: 'l_01',
        title: 'Drip Irrigation Basics',
        duration: '5 min read',
        category: 'Water',
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=400',
        content: "Drip irrigation is a type of micro-irrigation system that has the potential to save water and nutrients by allowing water to drip slowly to the roots of plants.\n\nIt is highly effective in drought-prone areas because it severely reduces evaporation compared to surface irrigation or sprinklers. By directing water exactly where it is needed — at the root zone — farmers can also significantly reduce weed growth.\n\nTo ensure your drip lines function properly, flush the pipes periodically to remove mineral buildup, especially if drawing water from a well or river. Always install a filter at the main valve to extend the lifespan of the emitters.",
        awardedBadge: 'Water Saver Badge',
        quiz: {
            question: "What is the primary benefit of drip irrigation in drought-prone areas?",
            options: ["It waters the leaves directly", "It reduces weed growth and evaporation", "It makes the soil saltier", "It attracts beneficial insects"],
            correctAnswer: 1
        }
    },
    {
        id: 'l_02',
        title: 'Drought-Resistant Seeds',
        duration: '4 min read',
        category: 'Crops',
        image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=400',
        content: "Using drought-resistant varieties like specific types of sorghum, millet, and resilient maize can guarantee a yield even when rainfall is scarce and unpredictable.\n\nThese hybrid and heirloom seeds have been specifically bred or cultivated over generations to withstand extended dry periods. They often feature deeper root systems, allowing them to tap into subsurface moisture when the topsoil dries out.\n\nFor a successful transition to drought-resistant crops, start by testing small plots alongside your traditional crops. This helps you understand the specific growth cycle and soil demands without risking your entire seasonal harvest.",
        awardedBadge: 'Seed Expert Badge',
        quiz: {
            question: "Why do drought-resistant seeds survive better during dry periods?",
            options: ["They do not need any water at all", "They reflect sunlight", "They have deeper root systems to tap subsurface moisture", "They grow much faster than normal seeds"],
            correctAnswer: 2
        }
    },
    {
        id: 'l_03',
        title: 'Soil Health Management',
        duration: '7 min read',
        category: 'Soil',
        image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400',
        content: "Healthy soil retains more water and supports stronger root systems. Incorporating organic matter, such as compost or manure, significantly increases soil resilience to climate shocks.\n\nMulching is another critical technique. By covering the soil with dry leaves, straw, or grass clippings, you protect the surface from direct sunlight. This drastically lowers ground temperature, preserves moisture, and prevents the topsoil from baking hard and washing away during sudden heavy rains.\n\nRemember to rotate your crops to prevent nutrient depletion. For instance, following a nitrogen-heavy crop like maize with a nitrogen-fixing legume like beans will naturally restore the soil's vitality.",
        awardedBadge: 'Soil Master Badge',
        quiz: {
            question: "What is a major benefit of mulching your soil?",
            options: ["It removes all pests from the farm", "It prevents the topsoil from baking hard and preserves moisture", "It replaces the need for seeds", "It increases soil temperature"],
            correctAnswer: 1
        }
    },
    {
        id: 'l_04',
        title: 'Pest Control Without Chemicals',
        duration: '6 min read',
        category: 'Crops',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
        content: "Integrated Pest Management (IPM) allows you to control crop damage without relying heavily on expensive synthetic pesticides.\n\nStrategies include introducing natural predators like ladybugs, or planting companion crops. For instance, planting marigolds near tomatoes can naturally repel certain nematodes and beetles.\n\nIf you must use sprays, consider homemade solutions such as neem oil extracts or garlic and chili mixtures, which can be highly effective against aphids and caterpillars without damaging the local ecosystem.",
        awardedBadge: 'Eco Warrior Badge',
        quiz: {
            question: "Which of these is an example of Integrated Pest Management (IPM)?",
            options: ["Using the strongest synthetic pesticide available", "Planting companion crops like marigolds near tomatoes", "Burning the entire field before planting", "Watering crops only at night"],
            correctAnswer: 1
        }
    }
];

export const mockFeed = [
    {
        id: 1,
        user: 'Kofi A.',
        time: '2 hours ago',
        text: 'Has anyone tried the new drought-tolerant maize sequence? Just harvested my first batch!',
        likes: 12,
        comments: 3,
        hasLiked: false
    },
    {
        id: 2,
        user: 'Amina S.',
        time: '5 hours ago',
        text: 'Reminder: The dry season starts next month. Make sure your drip lines are checked and cleared of any blockages.',
        likes: 24,
        comments: 1,
        hasLiked: true
    }
];
