import { MenuItem, TextField } from "@mui/material";
import { TypesOfMeasurements } from "../../app/measurements";
import { useState } from "react";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { CheckoutState } from "../../types/types";
import { EditCellLoader } from "../EditCellLoader/EditCellLoader";
import { selectDropdowStyles } from "../../constants/constants";

interface TypeOfMeasurementEditCells {
  typesOfMeasurements: TypesOfMeasurements;
  initialValue: string;
  params: GridRenderEditCellParams;
  editStatus: CheckoutState;
}

export const TypeOfMeasurementEditCells = ({
  typesOfMeasurements,
  initialValue,
  params,
  editStatus,
}: TypeOfMeasurementEditCells) => {
  const [chosenOption, setChosenOption] = useState<string>(initialValue);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value: newValue } = event.target;
    setChosenOption(newValue);
    params.api.setEditCellValue(
      {
        id: params.id,
        field: params.field,
        value: newValue,
      },
      true
    ); // true означает немедленное применение изменений
  };

  return (
    <EditCellLoader editStatus={editStatus}>
      <TextField
        select
        slotProps={selectDropdowStyles}
        value={chosenOption}
        onChange={handleChange}
        sx={{
          height: "100%", // Главный контейнер
          width: "100%",
          "& .MuiOutlinedInput-root": {
            height: "100%", // Корневой элемент ввода
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },

          "& .MuiSelect-icon": {
            display: editStatus === "LOADING" ? "none" : "block",
          },
        }}
      >
        {typesOfMeasurements.map((item, index) => (
          <MenuItem key={index} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
    </EditCellLoader>
  );
};
