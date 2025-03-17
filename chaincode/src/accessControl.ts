type RoleMap = Record<string, string[]>;

const RoleAccessMap: RoleMap = {
    ROLE_PRODUCER: ['produced'],
    ROLE_MANUFACTURER: ['installed'],
    ROLE_DISTRIBUTOR: ['in_use'],
    ROLE_OWNER: ['in_use'],
    ROLE_RECYCLER: ['recycled']
};

export function isAuthorized(role: string, currentState: string, newState: string): boolean {
    const allowedStates = RoleAccessMap[role] || [];
    return allowedStates.includes(newState);
}
  