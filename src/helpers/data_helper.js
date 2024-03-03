// returns time since timestamp in human readable form
function daysAgo (date) {
    // Math.round((new Date().getTime() - new Date(Math.round(currentData?.timestamp_occured))) / (1000 * 3600 * 24))
    const days = Math.round((new Date().getTime() - new Date(Math.round(date))) / (1000 * 3600 * 24));
    if (days === 0) {
      // return the local time of the date
      return new Date(Math.round(date)).toLocaleTimeString();
    } else {
      return `${days} days ago`;
    }
  };


  // give an icon based on the rule intent
  function getAlarmIcon (threats = []) {
    return threats.map(alarm => {
      if (alarm.rule_intent === "System Compromise") {
        return {
          ...alarm,
          icon: "mdi mdi-biohazard",
        }
      } else if (alarm.rule_intent === "Environmental Awareness") {
        return {
          ...alarm,
          icon: "mdi mdi-web",
        }
      } else if (alarm.rule_intent === "Exploit & Installation") {
        return {
          ...alarm,
          icon: "mdi mdi-alarm",
        }
      } else if (alarm.rule_intent === "Delivery & Attack") {
        return {
          ...alarm,
          icon: "mdi mdi-crosshairs-gps",
        }
      } else if (alarm.rule_intent === "Reconnaisannce & Probing") {
        return {
          ...alarm,
          icon: "mdi mdi-radar",
        }
      } else {
        return {
          ...alarm
        }
      }
    })
  }

// Get the icon for a mobile threat
function getLookoutThreatIcon (threats = []) {
  return threats.map(threat => {
    if (threat.type === "APPLICATION") {
      return {
        ...threat,
        icon: "mdi mdi-application",
      }
    } else if (threat.type === "FILE") {
      return {
        ...threat,
        icon: "mdi mdi-file-alert",
      }
    } else if (threat.type === "OS") {
      return {
        ...threat,
        icon: "mdi mdi-cellphone-iphone",
      }
    } else if (threat.type === "NETWORK") {
      return {
        ...threat,
        icon: "mdi mdi-close-network",
      }
    } else if (threat.type === "CONFIGURATION") {
      return {
        ...threat,
        icon: "mdi mdi-cog",
      }
    } else if (threat.type === "WEB_CONTENT") {
      return {
        ...threat,
        icon: "mdi mdi-web",
      }
    } else {
      return {
        ...threat
      }
    }
  })
}

// calculate the risk score
function getRiskScore (alarms = 0, darkweb = 0, coursestats = 0) {
  // calculate the risk score
  var riskScore = (alarms * 0.1) + (darkweb * 0.5) + (coursestats * 0.5);
  // make the risk score between 0 and 10
  riskScore = riskScore / 10;
  if (riskScore > 10) {
    riskScore = 10;
  } else if (riskScore < 0) {
    riskScore = 0;
  }
  // round to the nearest tenth
  riskScore = Math.round(riskScore * 10) / 10;
  return riskScore;
} 

export {
    daysAgo,
    getAlarmIcon,
    getRiskScore,
    getLookoutThreatIcon,
}