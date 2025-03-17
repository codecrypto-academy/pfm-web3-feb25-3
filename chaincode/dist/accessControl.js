"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = isAuthorized;
const RoleAccessMap = {
    ROLE_PRODUCER: ['produced'],
    ROLE_MANUFACTURER: ['installed'],
    ROLE_DISTRIBUTOR: ['in_use'],
    ROLE_OWNER: ['in_use'],
    ROLE_RECYCLER: ['recycled']
};
function isAuthorized(role, currentState, newState) {
    const allowedStates = RoleAccessMap[role] || [];
    return allowedStates.includes(newState);
}
