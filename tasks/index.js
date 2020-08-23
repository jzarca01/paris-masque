import * as TaskManager from "expo-task-manager";
import { LOCATION_TASK_NAME, LOCATION_UPDATE } from '../constants';

export default (eventEmitter) => TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      console.log("error task", error);
      return;
    }
    if (data) {
      const { locations } = data;
      const {
        coords: { latitude, longitude },
      } = locations[0];
      console.log("event emitted");
      eventEmitter.emit(LOCATION_UPDATE, { latitude, longitude });
    }
  });