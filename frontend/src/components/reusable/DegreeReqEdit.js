/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreeReqEdit.js
 *  This component is the popup child for editing degree requirement
 *  This component includes:
 *      - Degree Requirement name
 *      - School of the current Degree requirement
 *      - Degree of the current Degree requirement
 *      - All the Parts to this current Degree Requirement (DegreeReqPart)
 *
 */
import { useState } from "react";
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import pStyle from "./reusableStyles/Popup.module.css";
import Dropdown from "./Dropdown";
import DegreeReqPart from "./DegreeReqPart";
import dStyle from "./reusableStyles/DegreeReq.module.css";

const drDefault = {
  program_name: "",
  school: "",
  degree: "",
  parts: [
    {
      part_id: 0,
      part_name: "",
      part_desc: "",
      part_reqs: [
        {
          part_req_id: 0,
          course_num: "",
          course_note: "",
        },
      ],
      part_req_id_tracker: 1,
    },
  ],
  part_id_tracker: 1,
};

const schoolOptions = ["A&S", "ENG"];
const degreeOptions = ["B.S.", "B.A."];
function DegreeReqEdit(props) {
  const { onClose } = props;
  const [detail, setDetail] = useState(drDefault);

  const handleClose = () => {
    onClose();
  };

  const handleAdd = () => {
    /* do something API??  */

    /* Then Close */
    onClose();
  };

  const handleGeneralChange = (e) => {
    console.log("e:", e);
    setDetail((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /*  Controlled input for note  */
  const handlePartChange = (val, valType, partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              [valType]: val,
            }
          : part
      ),
    }));
  };

  const handleAddPart = () => {
    setDetail((prev) => ({
      ...prev,
      parts: [
        ...prev.parts,
        {
          ...drDefault.parts[0],
          part_id: prev.part_id_tracker,
        },
      ],
      part_id_tracker: prev.part_id_tracker + 1,
    }));
  };

  const handleRemovepart = (partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.filter((part) => part.part_id !== partID),
    }));
  };

  const handleCourseChange = (val, valType, courseID, partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              part_reqs: part.part_reqs.map((course) =>
                course.part_req_id === courseID
                  ? {
                      ...course,
                      [valType]: val,
                    }
                  : course
              ),
            }
          : part
      ),
    }));
  };

  const handleAddCourse = (partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              part_reqs: [
                ...part.part_reqs,
                {
                  ...drDefault.parts[0].part_reqs[0],
                  part_req_id: part.part_req_id_tracker,
                },
              ],
              part_req_id_tracker: part.part_req_id_tracker + 1,
            }
          : part
      ),
    }));
  };

  const handleRemoveCourse = (courseID, partID) => {
    console.log("partID courseID: ", partID, courseID);
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              part_reqs: part.part_reqs.filter(
                (course) => course.part_req_id !== courseID
              ),
            }
          : part
      ),
    }));
  };

  return (
    <div className={dStyle.drContainer}>
      <div className={dStyle.headerContainer}>
        <IconButton
          type="button"
          onClick={handleClose}
          className={pStyle.closeButton}
        >
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>=== {detail.program_name} ===</div>
        <span />
      </div>
      {/*   ================== Body ================== */}
      <div className={dStyle.formContainer}>
        <div className={dStyle.inputContainer}>
          <TextField
            size="large"
            onChange={handleGeneralChange}
            className={pStyle.inputAreaName}
            label="Name"
            name="program_name"
          />

          <Dropdown
            options={schoolOptions}
            selectedOption={detail.school}
            onOptionChange={handleGeneralChange}
            name="school"
            labelId="school_dropdown"
            labelName="School"
          />
          <Dropdown
            options={degreeOptions}
            selectedOption={detail.degree}
            onOptionChange={handleGeneralChange}
            name="degree"
            labelId="degree_dropdown"
            labelName="Degree"
          />

          {/* ------------ Parts ------------ */}
          <div className={dStyle.partsContainer}>
            {detail.parts?.map((part) => (
              <DegreeReqPart
                key={part.partID}
                partDetail={part}
                onPartChange={handlePartChange}
                onRemovePart={handleRemovepart}
                onCourseChange={handleCourseChange}
                onAddCourse={handleAddCourse}
                onRemoveCourse={handleRemoveCourse}
              />
            ))}
          </div>
          <Button startIcon={<AddIcon />} onClick={handleAddPart}>
            Add a Part
          </Button>
        </div>

        <Button className={pStyle.submitButton} onClick={handleAdd}>
          save
        </Button>
      </div>
    </div>
  );
}

export default DegreeReqEdit;
