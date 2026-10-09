/**
 * DRISHTI-SWARM: Global Swarm Agent State Store
 */

import { create } from 'zustand';
import { DisasterIncident } from '@/types/disaster';
import { AgentThoughtLog, BlackboardState, SwarmAgentInfo, SwarmMessage } from '@/types/swarm';
import { SwarmCoordinator } from '../agents/SwarmCoordinator';

interface SwarmStoreState {
  agents: SwarmAgentInfo[];
  thoughtLogs: AgentThoughtLog[];
  messages: SwarmMessage[];
  blackboard: BlackboardState;
  isDeliberating: boolean;
  selectedAgentId: string | null;

  // Actions
  setSelectedAgentId: (id: string | null) => void;
  triggerSwarmForIncident: (incident: DisasterIncident) => Promise<void>;
  clearLogs: () => void;
  refreshState: () => void;
}

const coordinator = SwarmCoordinator.getInstance();

export const useSwarmStore = create<SwarmStoreState>((set, get) => {
  // Subscribe to live coordinator thought logs
  coordinator.subscribeThoughtLogs((newLog) => {
    set((state) => ({
      thoughtLogs: [newLog, ...state.thoughtLogs].slice(0, 250),
      agents: coordinator.getAgents(),
      messages: coordinator.getMessages(),
      blackboard: coordinator.getBlackboard(),
    }));
  });

  return {
    agents: coordinator.getAgents(),
    thoughtLogs: coordinator.getThoughtLogs(),
    messages: coordinator.getMessages(),
    blackboard: coordinator.getBlackboard(),
    isDeliberating: false,
    selectedAgentId: 'master_commander',

    setSelectedAgentId: (id) => set({ selectedAgentId: id }),

    triggerSwarmForIncident: async (incident: DisasterIncident) => {
      set({ isDeliberating: true });
      try {
        const updatedBlackboard = await coordinator.executeSwarmDeliberation(incident);
        set({
          blackboard: updatedBlackboard,
          agents: coordinator.getAgents(),
          messages: coordinator.getMessages(),
          isDeliberating: false,
        });
      } catch (err) {
        console.error('Error in swarm deliberation:', err);
        set({ isDeliberating: false });
      }
    },

    clearLogs: () => {
      set({ thoughtLogs: [] });
    },

    refreshState: () => {
      set({
        agents: coordinator.getAgents(),
        thoughtLogs: coordinator.getThoughtLogs(),
        messages: coordinator.getMessages(),
        blackboard: coordinator.getBlackboard(),
      });
    },
  };
});
