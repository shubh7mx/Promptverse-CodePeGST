/**
 * DRISHTI-SWARM: Swarm Agent Types & Blackboard Protocols
 */

import { AlertSeverity, DisasterCategory, GeoCoordinate } from './disaster';

export type AgentRole =
  | 'master_commander'
  | 'flood_sentinel'
  | 'wildfire_sentinel'
  | 'cyclone_sentinel'
  | 'geohazard_sentinel'
  | 'evacuation_router'
  | 'logistics_optimizer'
  | 'multilingual_broadcast';

export type AgentStatus = 'IDLE' | 'ANALYZING' | 'REASONING' | 'CONSENSUS_REACHED' | 'DISPATCHING';

export interface SwarmAgentInfo {
  id: AgentRole;
  name: string;
  roleTitle: string;
  domain: string;
  avatarIcon: string;
  status: AgentStatus;
  healthPercent: number;
  lastActive: string;
  confidenceScore: number; // 0 - 100%
  processedEventsCount: number;
  currentTask?: string;
}

export type StepType = 'PERCEPTION' | 'REASONING' | 'TOOL_CALL' | 'CROSS_AGENT_COMM' | 'DECISION' | 'ACTION';

export interface AgentThoughtLog {
  id: string;
  timestamp: string;
  agentId: AgentRole;
  agentName: string;
  stepType: StepType;
  content: string;
  severity?: AlertSeverity;
  dataPayload?: Record<string, unknown>;
}

export interface SwarmMessage {
  id: string;
  timestamp: string;
  fromAgent: AgentRole;
  toAgent: AgentRole | 'BROADCAST';
  messageType: 'THREAT_DETECTION' | 'PREDICTION_UPDATE' | 'ROUTE_REQUEST' | 'LOGISTICS_QUOTA' | 'ALERT_BROADCAST';
  subject: string;
  body: string;
  confidence: number;
  affectedCoordinates?: GeoCoordinate;
  severity: AlertSeverity;
}

export interface BlackboardState {
  lastUpdated: string;
  compositeThreatLevel: AlertSeverity;
  activeDisastersCount: number;
  activeHazards: {
    floodRiskIndex: number;
    wildfireRiskIndex: number;
    cycloneRiskIndex: number;
    landslideRiskIndex: number;
    seismicRiskIndex: number;
  };
  evacuationRoutesActive: number;
  ndrfBattalionsMobilized: number;
  broadcastsIssuedCount: number;
  consensusSummary: string;
  recommendedActions: string[];
}
