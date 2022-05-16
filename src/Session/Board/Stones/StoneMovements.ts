export const stoneMovements: any = {
    'CHICKEN': {
        'opponent': {
            A1: ['A2'],
            A2: ['A3'],
            A3: ['A4'],
            A4: [],
            B1: ['B2'],
            B2: ['B3'],
            B3: ['B4'],
            B4: [],
            C1: ['C2'],
            C2: ['C3'],
            C3: ['C4'],
            C4: []
        },
        'creator': {
            A4: ['A3'],
            A3: ['A2'],
            A2: ['A1'],
            A1: [],
            B4: ['B3'],
            B3: ['B2'],
            B2: ['B1'],
            B1: [],
            C4: ['C3'],
            C3: ['C2'],
            C2: ['C1'],
            C1: []
        }
    },
    'GIRAFFE': {
        A1: ['A2', 'B1'],
        A2: ['A1', 'A3', 'B2'],
        A3: ['A2', 'A4', 'B3'],
        A4: ['A3', 'B4'],
        B1: ['A1', 'C1', 'B2'],
        B2: ['B1', 'B3', 'A2', 'C2'],
        B3: ['B2', 'B4', 'A3', 'C3'],
        B4: ['B3', 'A4', 'C4'],
        C1: ['C2', 'B1'],
        C2: ['C1', 'C3', 'B2'],
        C3: ['C2', 'C4', 'B3'],
        C4: ['C3', 'B4']
    },
    'ELEPHANT': {
        A1: ['B2'],
        A2: ['B1', 'B3'],
        A3: ['B2', 'B4'],
        A4: ['B3'],
        B1: ['A2', 'C2'],
        B2: ['A1', 'C1', 'A3', 'C3'],
        B3: ['A2', 'C2', 'A4', 'C4'],
        B4: ['A3', 'C3'],
        C1: ['B2'],
        C2: ['B1', 'B3'],
        C3: ['B2', 'B4'],
        C4: ['B3']
    },
    'LION': {
        A1: ['A2', 'B1', 'B2'],
        A2: ['A1', 'A3', 'B1', 'B2', 'B3'],
        A3: ['A2', 'A4', 'B2', 'B3', 'B4'],
        A4: ['A3', 'B3', 'B4'],
        B1: ['A1', 'C1', 'A2', 'B2', 'C2'],
        B2: ['A1', 'A2', 'A3', 'B1', 'B3', 'C1', 'C2', 'C3'],
        B3: ['A2', 'A3', 'A4', 'B2', 'B4', 'C2', 'C3', 'C4'],
        B4: ['A3', 'A4', 'B3', 'C3', 'C4'],
        C1: ['B1', 'B2', 'C2'],
        C2: ['B1', 'B2', 'B3', 'C1', 'C3'],
        C3: ['B2', 'B3', 'B4', 'C2', 'C4'],
        C4: ['B3', 'B4', 'C3']
    },
    'HEN': {
        A1: [],
        A2: [],
        A3: [],
        A4: [],
        B1: [],
        B2: [],
        B3: [],
        B4: [],
        C1: [],
        C2: [],
        C3: [],
        C4: []
    }
};