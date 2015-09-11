Class MqttHelper {

  static toType(topic) {

    switch(topic) {
      case 'g':
      case 'groups':
        return 'group';
      case 'f':
      case 'feeds':
        return 'feed';
      case 'b':
      case 'blocks':
        return 'block';
      case 's':
      case 'streams':
        return 'stream';
      case 't':
      case 'tokens':
        return 'token';
      default:
        return false;
    }

  }

  static typeToShort(t) {
    return t.charAt(0);
  }

  static typeToLong(t) {
    return t + 's';
  }

  toMessage(packet) {

    const topic = packet.topic.split('/'),
          type = this.toType(topic[1]);

    if(! type)
      return false;

    if(topic[3] === 'csv') {

      try {
        packet.payload = this.parseCSV(type, packet.payload);
      } catch(e) {
        return false;
      }

    }

    return message = {
      username: topic[0],
      type: type,
      id: topic[2],
      payload: packet.payload
    };

  };

  toPacket(username, id, payload, type, short, suffix) {

    const topic = [];

    if(short)
      type = this.typeToShort(type);
    else
      type = this.typeToLong(type);

    topic = [username, type, id];

    if(suffix)
      topic = topic.concat(suffix);

    return {
      topic: topic.join('/'),
      payload: payload,
      qos: 1,
      retain: true
    };

  }

  parseCSV(type, payload) {

    const csv = payload.toString().split(',');

    if(type == 'feed') {

      if(csv.length < 2)
        return payload;

      return JSON.stringify({
        value: csv[0].toString().trim(),
        lat: (csv[1] || 0).toString().trim(),
        lon: (csv[2] || 0).toString().trim(),
        ele: (csv[3] || 0).toString().trim()
      });

    }

    const lines = payload.toString().split('\n');

    payload = { feeds: {} };

    lines.forEach((line) => {

      const csv = line.toString().split(',');

      if(csv.length < 2)
        return;

      if(csv[0].trim() === 'location') {

        return payload.location = {
          lat: (csv[1] || '0').trim(),
          lon: (csv[2] || '0').trim(),
          ele: (csv[3] || '0').trim()
        };

      }

      payload.feeds[csv[0].trim()] = csv[1].trim();

    });

    return JSON.stringify(payload);

  }

}
