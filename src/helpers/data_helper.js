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

export {
    daysAgo,
    getAlarmIcon
}