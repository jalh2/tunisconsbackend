const iconMappings = {
  // Construction related
  'construction': 'faHardHat',
  'building': 'faBuilding',
  'renovation': 'faHammer',
  'design': 'faPencilRuler',
  'architecture': 'faCompass',
  'planning': 'faClipboardList',
  'engineering': 'faWrench',
  'maintenance': 'faScrewdriver',
  'consulting': 'faComments',
  'project': 'faProjectDiagram',
  'development': 'faCogs',
  'management': 'faTasks',
  'supervision': 'faUserHardHat',
  'interior': 'faCouch',
  'exterior': 'faHome',
  'residential': 'faHouseUser',
  'commercial': 'faStore',
  'industrial': 'faIndustry',
  'safety': 'faHardHat',
  'quality': 'faCheckCircle',
  'sustainable': 'faLeaf',
  'green': 'faLeaf',
  'eco': 'faLeaf',
  'infrastructure': 'faRoad',
  'electrical': 'faBolt',
  'plumbing': 'faFaucet',
  'hvac': 'faFan',
  'painting': 'faPaintRoller',
  'flooring': 'faSquare',
  'roofing': 'faHome',
  'landscaping': 'faTree',
  'demolition': 'faHammer',
  'renovation': 'faTools',
  'remodeling': 'faHammer',
  'inspection': 'faSearchPlus',
  'estimation': 'faCalculator',
  'concrete': 'faCubes',
  'steel': 'faCube',
  'wood': 'faTree',
  'metal': 'faCube',
  'glass': 'faSquare',
  'ceramic': 'faSquare',
  'default': 'faWrench'  // Default icon if no match is found
};

function getIconForService(serviceName) {
  if (!serviceName) return iconMappings.default;
  
  // Convert service name to lowercase for matching
  const serviceNameLower = serviceName.toLowerCase();
  
  // Find the first matching keyword in the service name
  const matchedKey = Object.keys(iconMappings).find(key => 
    serviceNameLower.includes(key)
  );
  
  // Return the matched icon or default if no match
  return matchedKey ? iconMappings[matchedKey] : iconMappings.default;
}

module.exports = { getIconForService };
