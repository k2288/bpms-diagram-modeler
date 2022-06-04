import templeteCommonDBTask from "./element-templates/010_CommonDBTask";
import templeteCommonMultiSaveTask from "./element-templates/020_CommonMultiSaveTask";
import templeteCommonUserTask from "./element-templates/110_UserTask";
import templeteCommonDummyTask from "./element-templates/120_DummyTask";
import templeteCommonParseMessageTask from "./element-templates/310_ParseMessageTask";
import templeteCommonCreateMessageTask from "./element-templates/320_CreateMessageTask";
import templeteCommonSubServiceTaskTask from "./element-templates/410_SubServiceTask";
import templeteCommonEhDeleteTask from "./element-templates/CommonEhDeleteTask";
import templeteCommonEhGridSaveTask from "./element-templates/CommonEhGridSaveTask";
import templeteCommonEhInsertTask from "./element-templates/CommonEhInsertTask";
import templeteCommonEhSelectTask from "./element-templates/CommonEhSelectTask";
import templeteCommonEhUpdateTask from "./element-templates/CommonEhUpdateTask";
import templeateRpa from "./element-templates/rpa";
import templeateSample from "./element-templates/sample";

let elementTemplates = [
  ...templeteCommonDBTask,
  ...templeteCommonMultiSaveTask,
  ...templeteCommonUserTask,
  ...templeteCommonDummyTask,
  ...templeteCommonParseMessageTask,
  ...templeteCommonCreateMessageTask,
  ...templeteCommonSubServiceTaskTask,
  templeteCommonEhSelectTask,
  templeteCommonEhUpdateTask,
  templeteCommonEhInsertTask,
  templeteCommonEhDeleteTask,
  templeteCommonEhGridSaveTask,
  templeateRpa,
  ...templeateSample
  // ...templeateXss
];
export default elementTemplates;
