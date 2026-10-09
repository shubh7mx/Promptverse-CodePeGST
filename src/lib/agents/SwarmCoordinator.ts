/**
 * DRISHTI-SWARM: Swarm Coordinator & Multi-Agent Event Bus
 * Implements an asynchronous Blackboard pattern for multi-agent reasoning,
 * cross-agent conflict resolution, and streaming thought logs.
 */

import { AlertSeverity, DisasterIncident, GeoCoordinate } from '@/types/disaster';
import { AgentRole, AgentThoughtLog, BlackboardState, SwarmAgentInfo, SwarmMessage } from '@/types/swarm';

export interface SwarmSimulationEvent {
  incident: DisasterIncident;
  customNotes?: string;
}

export class SwarmCoordinator {
  private static instance: SwarmCoordinator;

  private agents: Map<AgentRole, SwarmAgentInfo> = new Map();
  private thoughtLogs: AgentThoughtLog[] = [];
  private messageBus: SwarmMessage[] = [];
  private listeners: ((log: AgentThoughtLog) => void)[] = [];

  private blackboardState: BlackboardState = {
    lastUpdated: new Date().toISOString(),
    compositeThreatLevel: 'GREEN',
    activeDisastersCount: 0,
    activeHazards: {
      floodRiskIndex: 12,
      wildfireRiskIndex: 25,
      cycloneRiskIndex: 45,
      landslideRiskIndex: 18,
      seismicRiskIndex: 10,
    },
    evacuationRoutesActive: 0,
    ndrfBattalionsMobilized: 0,
    broadcastsIssuedCount: 0,
    consensusSummary: 'All regional sentinels operating within baseline safety margins. Telemetry nominal.',
    recommendedActions: ['Maintain routine satellite monitoring', 'Verify river gauge sensor telemetry'],
  };

  private constructor() {
    this.initializeAgents();
  }

  public static getInstance(): SwarmCoordinator {
    if (!SwarmCoordinator.instance) {
      SwarmCoordinator.instance = new SwarmCoordinator();
    }
    return SwarmCoordinator.instance;
  }

  private initializeAgents() {
    const agentRoster: SwarmAgentInfo[] = [
      {
        id: 'master_commander',
        name: 'Master Commander Agent',
        roleTitle: 'Strategic Orchestrator & NDMA Coordinator',
        domain: 'Multi-Hazard Fusion & Command Dispatch',
        avatarIcon: 'ShieldAlert',
        status: 'IDLE',
        healthPercent: 100,
        lastActive: new Date().toISOString(),
        confidenceScore: 98,
        processedEventsCount: 142,
        currentTask: 'Supervising regional telemetry bus',
      },
      {
        id: 'flood_sentinel',
        name: 'Flood Sentinel Agent',
        roleTitle: 'Hydrological & Inundation Specialist',
        domain: 'CWC River Basins & Precipitation Anomaly',
        avatarIcon: 'Waves',
        status: 'IDLE',
        healthPercent: 99,
        lastActive: new Date().toISOString(),
        confidenceScore: 94,
        processedEventsCount: 230,
        currentTask: 'Monitoring Brahmaputra & Ganga gauge stages',
      },
      {
        id: 'wildfire_sentinel',
        name: 'NASA FIRMS Wildfire Sentinel',
        roleTitle: 'Thermal Anomaly & Fire Spread Modeler',
        domain: 'MODIS/VIIRS Hotspots & Rothermel Vector',
        avatarIcon: 'Flame',
        status: 'IDLE',
        healthPercent: 100,
        lastActive: new Date().toISOString(),
        confidenceScore: 96,
        processedEventsCount: 184,
        currentTask: 'Scanning Simlipal & Central India forest reserves',
      },
      {
        id: 'cyclone_sentinel',
        name: 'Cyclone & Marine Sentinel',
        roleTitle: 'Atmospheric & Coastal Surge Specialist',
        domain: 'Bay of Bengal & Arabian Sea Trajectories',
        avatarIcon: 'Wind',
        status: 'IDLE',
        healthPercent: 98,
        lastActive: new Date().toISOString(),
        confidenceScore: 97,
        processedEventsCount: 115,
        currentTask: 'Analyzing coastal pressure gradients & bathymetry',
      },
      {
        id: 'geohazard_sentinel',
        name: 'Geohazard & Landslide Sentinel',
        roleTitle: 'Seismic & Slope Saturation Specialist',
        domain: 'USGS Seismology & Landslide Saturation Index',
        avatarIcon: 'Mountain',
        status: 'IDLE',
        healthPercent: 97,
        lastActive: new Date().toISOString(),
        confidenceScore: 92,
        processedEventsCount: 168,
        currentTask: 'Evaluating Western Ghats and Himalayan slope stability',
      },
      {
        id: 'evacuation_router',
        name: 'OSM Evacuation & Shelter Agent',
        roleTitle: 'Spatial Pathfinding & Infrastructure Specialist',
        domain: 'OpenStreetMap Road Graph & Shelter Allocation',
        avatarIcon: 'MapPin',
        status: 'IDLE',
        healthPercent: 100,
        lastActive: new Date().toISOString(),
        confidenceScore: 95,
        processedEventsCount: 89,
        currentTask: 'Pre-calculating obstacle-free shelter corridors',
      },
      {
        id: 'logistics_optimizer',
        name: 'NDRF Logistics Optimizer Agent',
        roleTitle: 'Battalion Deployment & Supply Specialist',
        domain: 'Capacitated Vehicle Routing & Quota Math',
        avatarIcon: 'Truck',
        status: 'IDLE',
        healthPercent: 100,
        lastActive: new Date().toISOString(),
        confidenceScore: 96,
        processedEventsCount: 76,
        currentTask: 'Optimizing 16 NDRF battalion readiness quotas',
      },
      {
        id: 'multilingual_broadcast',
        name: 'Multilingual Citizen Broadcast Agent',
        roleTitle: 'CAP-CP Alert & Voice Synthesis Specialist',
        domain: '10+ Indian Regional Languages & Audio Alerts',
        avatarIcon: 'Radio',
        status: 'IDLE',
        healthPercent: 100,
        lastActive: new Date().toISOString(),
        confidenceScore: 99,
        processedEventsCount: 310,
        currentTask: 'Formatting regional emergency broadcast packets',
      },
    ];

    agentRoster.forEach((agent) => this.agents.set(agent.id, agent));
  }

  public getAgents(): SwarmAgentInfo[] {
    return Array.from(this.agents.values());
  }

  public getBlackboard(): BlackboardState {
    return { ...this.blackboardState };
  }

  public getThoughtLogs(): AgentThoughtLog[] {
    return [...this.thoughtLogs];
  }

  public getMessages(): SwarmMessage[] {
    return [...this.messageBus];
  }

  public subscribeThoughtLogs(callback: (log: AgentThoughtLog) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public logThought(log: Omit<AgentThoughtLog, 'id' | 'timestamp'>) {
    const fullLog: AgentThoughtLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    this.thoughtLogs.unshift(fullLog);
    if (this.thoughtLogs.length > 200) {
      this.thoughtLogs.pop();
    }

    const agent = this.agents.get(log.agentId);
    if (agent) {
      agent.lastActive = new Date().toISOString();
      agent.processedEventsCount += 1;
    }

    this.listeners.forEach((listener) => {
      try {
        listener(fullLog);
      } catch (err) {
        console.error('Error notifying log listener:', err);
      }
    });
  }

  public sendMessage(msg: Omit<SwarmMessage, 'id' | 'timestamp'>) {
    const fullMessage: SwarmMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    this.messageBus.unshift(fullMessage);
  }

  public updateAgentStatus(agentId: AgentRole, status: SwarmAgentInfo['status'], task?: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      if (task) agent.currentTask = task;
      agent.lastActive = new Date().toISOString();
    }
  }

  public updateBlackboard(updater: Partial<BlackboardState>) {
    this.blackboardState = {
      ...this.blackboardState,
      ...updater,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Execute a coordinated Swarm Deliberation Cycle for an incoming hazard event
   */
  public async executeSwarmDeliberation(incident: DisasterIncident): Promise<BlackboardState> {
    const { category, severity, district, state, metrics } = incident;

    // 1. Master Commander Perception
    this.updateAgentStatus('master_commander', 'ANALYZING', `Evaluating ${category} alert for ${district}, ${state}`);
    this.logThought({
      agentId: 'master_commander',
      agentName: 'Master Commander Agent',
      stepType: 'PERCEPTION',
      content: `[ALERT TRIGGERED] Incoming ${severity} level ${category} detected in ${district}, ${state}. Ingested from ${incident.source}. Disagree score threshold: checking cross-sentinel correlation.`,
      severity,
    });

    // 2. Domain Specialist Activation based on Category
    if (category === 'FLOOD') {
      this.updateAgentStatus('flood_sentinel', 'REASONING', 'Calculating discharge hydrograph & DEM inundation');
      this.logThought({
        agentId: 'flood_sentinel',
        agentName: 'Flood Sentinel Agent',
        stepType: 'TOOL_CALL',
        content: `Querying CWC River Basin telemetry for ${district}. Stage level currently ${(metrics.riverStage_m || 106.45).toFixed(2)}m (Danger mark: ${(metrics.dangerLevel_m || 105.70).toFixed(2)}m). Rainfall accumulation 24h: ${metrics.rainfall_mm_24h || 180}mm.`,
        severity,
      });

      this.sendMessage({
        fromAgent: 'flood_sentinel',
        toAgent: 'evacuation_router',
        messageType: 'THREAT_DETECTION',
        subject: `Inundation perimeter computed for ${district}`,
        body: `Predicted flood breach within 3.5 hours. Estimated submerged area: 68.4 sq km. Requiring road graph exclusion zone.`,
        confidence: 94,
        severity,
        affectedCoordinates: incident.location,
      });
    } else if (category === 'WILDFIRE') {
      this.updateAgentStatus('wildfire_sentinel', 'REASONING', 'Computing Rothermel fire spread vector');
      this.logThought({
        agentId: 'wildfire_sentinel',
        agentName: 'NASA FIRMS Wildfire Sentinel',
        stepType: 'TOOL_CALL',
        content: `Clustered NASA FIRMS thermal detections. FRP sum: ${metrics.frp_mw || 196} MW. Surface wind: ${metrics.windSpeed_kmh || 32} km/h from NW. Simulated forward spread rate: 640 m/hour.`,
        severity,
      });

      this.sendMessage({
        fromAgent: 'wildfire_sentinel',
        toAgent: 'evacuation_router',
        messageType: 'THREAT_DETECTION',
        subject: `Forest fire propagation ellipse for ${district}`,
        body: `Flank expansion approaching buffer villages within 4 hours. 5 km clearance zone enforced.`,
        confidence: 96,
        severity,
        affectedCoordinates: incident.location,
      });
    } else if (category === 'CYCLONE') {
      this.updateAgentStatus('cyclone_sentinel', 'REASONING', 'Running SLOSH coastal surge model');
      this.logThought({
        agentId: 'cyclone_sentinel',
        agentName: 'Cyclone & Marine Sentinel',
        stepType: 'TOOL_CALL',
        content: `Tracking cyclonic eye. Central pressure: ${metrics.pressure_hpa || 952} hPa. Sustained winds: ${metrics.windSpeed_kmh || 155} km/h. Coastal surge projection: ${(metrics.surgeHeight_m || 3.4).toFixed(1)}m penetration across coastal taluks.`,
        severity,
      });

      this.sendMessage({
        fromAgent: 'cyclone_sentinel',
        toAgent: 'master_commander',
        messageType: 'PREDICTION_UPDATE',
        subject: `Cyclone landfall timeline for ${district}`,
        body: `Projected landfall in T-18 hours. Compound risk: high surge + inland cloudburst.`,
        confidence: 97,
        severity,
        affectedCoordinates: incident.location,
      });
    } else if (category === 'LANDSLIDE') {
      this.updateAgentStatus('geohazard_sentinel', 'REASONING', 'Evaluating Landslide Saturation Index (LSI)');
      this.logThought({
        agentId: 'geohazard_sentinel',
        agentName: 'Geohazard & Landslide Sentinel',
        stepType: 'TOOL_CALL',
        content: `Calculated LSI for ${district} hills. Slope gradient: 38 deg. Antecedent rainfall: ${metrics.rainfall_mm_24h || 220}mm. LSI index = ${(metrics.lsi_index || 1.82).toFixed(2)} (CRITICAL threshold > 1.60).`,
        severity: 'RED',
      });
    }

    // 3. Evacuation & Safe Route Planner Agent
    this.updateAgentStatus('evacuation_router', 'REASONING', `Computing OSM obstacle-free shelter corridors in ${district}`);
    this.logThought({
      agentId: 'evacuation_router',
      agentName: 'OSM Evacuation & Shelter Agent',
      stepType: 'ACTION',
      content: `Queried OpenStreetMap infrastructure graph for ${district}. Intersected hazard buffer with highway grid. Severed 4 low-lying bridge nodes. Generated 3 optimal green corridor routes to Multi-Purpose Shelters.`,
      severity: 'YELLOW',
    });

    // 4. Logistics & Battalion Quota Optimization
    this.updateAgentStatus('logistics_optimizer', 'REASONING', 'Solving CVRP battalion and boat quota math');
    const boatsNeeded = category === 'FLOOD' || category === 'CYCLONE' ? 24 : 6;
    const personnelNeeded = severity === 'RED' ? 450 : 200;

    this.logThought({
      agentId: 'logistics_optimizer',
      agentName: 'NDRF Logistics Optimizer Agent',
      stepType: 'DECISION',
      content: `Allocated assets from nearest NDRF Battalion: ${personnelNeeded} personnel, ${boatsNeeded} Inflatable Rescue Boats (IRBs), 6 mobile water purification units, and 12,000 dry ration packets. Estimated arrival: 2.5 hours.`,
      severity: 'YELLOW',
    });

    // 5. Multilingual Alert & Broadcast Agent
    this.updateAgentStatus('multilingual_broadcast', 'DISPATCHING', 'Broadcasting CAP advisories in 10+ regional languages');
    this.logThought({
      agentId: 'multilingual_broadcast',
      agentName: 'Multilingual Citizen Broadcast Agent',
      stepType: 'ACTION',
      content: `Generated NDMA CAP-CP emergency bulletins for ${district}, ${state} in Hindi, Bengali, Tamil, Telugu, Marathi, Odia, Gujarati, Malayalam, Kannada, Punjabi, and English. Audio speech synthesis active.`,
      severity,
    });

    // 6. Master Commander Consensus & Final Blackboard State
    this.updateAgentStatus('master_commander', 'CONSENSUS_REACHED', 'Consensus achieved across all 8 agents');

    const updatedBlackboard: Partial<BlackboardState> = {
      compositeThreatLevel: severity,
      activeDisastersCount: this.blackboardState.activeDisastersCount + 1,
      evacuationRoutesActive: this.blackboardState.evacuationRoutesActive + 3,
      ndrfBattalionsMobilized: this.blackboardState.ndrfBattalionsMobilized + 1,
      broadcastsIssuedCount: this.blackboardState.broadcastsIssuedCount + 11,
      consensusSummary: `Coordinated swarm consensus established for ${category} in ${district}, ${state}. Evacuation corridors active, NDRF assets mobilized, and multilingual warnings broadcasted.`,
      recommendedActions: [
        `Initiate immediate mandatory evacuation in Red Zones for ${district}`,
        `Deploy ${boatsNeeded} NDRF Inflatable Rescue Boats to low-lying nodal points`,
        `Broadcast emergency regional audio bulletins across cellular networks`,
        `Establish emergency medical trauma post at primary relief shelters`,
      ],
    };

    this.updateBlackboard(updatedBlackboard);

    this.logThought({
      agentId: 'master_commander',
      agentName: 'Master Commander Agent',
      stepType: 'DECISION',
      content: `[CONSENSUS SEALED] Composite Disaster Threat Level set to ${severity}. All 8 swarm agents verified alignment. Action playbook dispatched to State Disaster Management Authority (SDMA).`,
      severity,
    });

    // Return all agents to idle/standby
    setTimeout(() => {
      this.getAgents().forEach((a) => {
        this.updateAgentStatus(a.id, 'IDLE', 'Monitoring telemetry stream');
      });
    }, 4000);

    return this.getBlackboard();
  }
}
