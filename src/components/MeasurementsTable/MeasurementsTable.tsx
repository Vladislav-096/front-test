import { Measurement, TypesOfMeasurements } from "../../app/measurements";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderEditCellParams,
  GridRowModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import React, { useState } from "react";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { CheckoutState } from "../../types/types";
import { EditAfterMeasurementModal } from "../../features/editAfterMealMeasurementModal/EditAfterMealMeasurementModa";
import {
  controlPanelStyles,
  dataGridStylesTest,
  initialAfterMealMeasurement,
  validationRules,
} from "../../constants/constants";
import { CreatedAtEditCells } from "../CreatedAtEditCells/CreatedAtEditCells";
import {
  convertTime,
  convertTimestampToDate,
  mergeDateAndTime,
} from "../../utils/dateTimeConvert";
import dayjs from "dayjs";
import { areTableRowsEqual } from "../../utils/areTableRowsEqual";
import { TimeEditCells } from "../TimeEditCells/TimeEditCells";
import { CustomTableToolbar } from "../CustomTableToolbar/CustomTableToolbar";
import { CustomDateFilterField } from "../CustomDateFilterField/CustomDateFilterField";
import { CustomMeasurementTypeFilterField } from "../CustomMeasurementTypeFilterField/CustomMeasurementTypeFilterField";
import { MeasurementRenderEditCells } from "../MeasrementRenderEditCells/MeasurementRenderEditCells";
import { ActionsCells } from "../ActionsCells/ActionsCells";
import { MeasurementRenderCells } from "../MeasurementRenderCells/MeasurementRenderCells";
import { TypeOfMeasurementEditCells } from "../TypeOfMeasurementEditCells/TypeOfMeasurementEditCells";
import { CustomErrorAlert } from "../CustomErrorAlert/CustomErrorAlert";
import { getDateStringFromUnix } from "../../utils/getDateTimeStringFromUnix";

interface Rows extends Measurement {
  time: string;
}

interface MeasurementsTable {
  rows: Rows[];
  typesOfMeasurement: TypesOfMeasurements;
  dispatchRemoveMeasurement: (id: string) => void;
  // Нету типа никакого, решить эту проблему
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatchEditMeasurementSync: any;
  editStatus: CheckoutState;
  removeStatus: CheckoutState;
}

const tablePageSize = 10;

export const MeasurementsTable = ({
  rows,
  typesOfMeasurement,
  dispatchRemoveMeasurement,
  dispatchEditMeasurementSync,
  editStatus,
  removeStatus,
}: MeasurementsTable) => {
  const defaultMeasurementValue = "Just Measurement";
  const [openRemoveConfirmModal, setOpenRemoveConfirmModal] =
    useState<boolean>(false);
  const handleOpenRemoveConfirmModal = () => setOpenRemoveConfirmModal(true);
  const handleCloseRemoveConfirmCloseModal = () =>
    setOpenRemoveConfirmModal(false);
  const [
    openEditAfterMealMeasurementModal,
    setOpenEditAfterMealMeasurementModal,
  ] = useState<boolean>(false);
  const handleOpenEditAfterMealMeasurementModal = () =>
    setOpenEditAfterMealMeasurementModal(true);
  const handleCloseEditAfterMealMeasurementModal = () =>
    setOpenEditAfterMealMeasurementModal(false);
  const [idToRemove, setIdToRemove] = useState<string>("");
  // Для модалки редактирования after meal замеров, а так туда полностью замер отдаю.
  // Переименовать по человечески стейт
  const [afterMealMeasurement, setAfterMealMeasurement] = useState<Measurement>(
    initialAfterMealMeasurement
  );
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 92,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (param) => (
        <ActionsCells
          row={param.row}
          setIdToRemove={setIdToRemove}
          handleOpenRemoveConfirmModal={handleOpenRemoveConfirmModal}
        />
      ),
      filterable: false,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      filterOperators: [
        {
          value: "contains",
          label: "contains",
          getApplyFilterFn: (filterItem) => {
            return (value) => {
              if (filterItem.value) {
                const formattedValues = dayjs(value * 1000).format(
                  "DD.MM.YYYY"
                );
                return formattedValues.includes(
                  filterItem.value.toString().toLowerCase()
                );
              } else {
                return true;
              }
            };
          },
          InputComponent: CustomDateFilterField,
        },
      ],
      width: 160,
      valueFormatter: (value) => getDateStringFromUnix(value),
      // type: "date",
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <CreatedAtEditCells
            editStatus={editStatus}
            initialValue={convertTimestampToDate(params.value)} // YYYY-MM-DD
            params={params}
          />
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      filterOperators: [
        {
          value: "contains",
          label: "contains",
          getApplyFilterFn: (filterItem) => {
            return (value) => {
              if (filterItem.value) {
                const formattedValues = dayjs(value * 1000).format(
                  "DD.MM.YYYY"
                );
                return formattedValues.includes(
                  filterItem.value.toString().toLowerCase()
                );
              } else {
                return true;
              }
            };
          },
          InputComponent: CustomDateFilterField,
        },
      ],
      width: 135,
      valueFormatter: (value) => getDateStringFromUnix(value),
      // editable: true,
    },
    {
      field: "time",
      headerName: "Time",
      width: 115,
      editable: true,
      // Пометочка: Могу брать значение из разных ключей rows объекта через valueGetter. В valueFormatter, как я понял,
      // тоже есть row, но через него такое провернуть нельзя. valueFormatter я использовл в таблице
      // чтобы измнить значение, которое на прямую получаю.
      // valueGetter: (_, row) => {
      //   // console.log("here", row);
      //   return getTimeStringFromUnix(row.createdAt);
      // },
      // valueFormatter: (value) => {
      //   getTimeStringFromUnix(value);
      // },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <TimeEditCells
            editStatus={editStatus}
            initialValue={convertTime(params.value)}
            params={params}
          />
        );
      },
    },
    {
      field: "typeOfMeasurement",
      headerName: "Measurement Type",
      width: 195,
      filterOperators: [
        {
          value: "contains",
          label: "contains",
          getApplyFilterFn: (filterItem) => {
            return (value) => {
              if (filterItem.value) {
                const type = typesOfMeasurement.find(
                  (item) => item.id === value
                )?.name;

                if (type) {
                  return type
                    .toLowerCase()
                    .includes(filterItem.value.toString().toLowerCase());
                } else {
                  return true;
                }
              } else {
                return true;
              }
            };
          },
          InputComponent: CustomMeasurementTypeFilterField,
        },
      ],
      valueFormatter: (value) => {
        const test = typesOfMeasurement.find((elem) => elem.id === value);
        if (test) {
          return test.name;
        }
        return defaultMeasurementValue;
      },
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <TypeOfMeasurementEditCells
          editStatus={editStatus}
          typesOfMeasurements={typesOfMeasurement}
          params={params}
          initialValue={params.value}
        />
      ),
    },
    {
      field: "measurement",
      headerName: "Measurement",
      width: 140,
      renderCell: (param) => <MeasurementRenderCells row={param.row} />,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <MeasurementRenderEditCells params={params} editStatus={editStatus} />
      ),
      editable: true,
    },
  ];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: tablePageSize,
  });

  const handlePaginationModelChange = (newPaginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPaginationModel(newPaginationModel);
  };

  const useEditMutation = () => {
    return React.useCallback(async (data: Measurement) => {
      const res = dispatchEditMeasurementSync(data);
      return res;
    }, []);
  };

  const mutateRow = useEditMutation();

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel, oldRow: GridValidRowModel) => {
      const areObjectsTheSame = areTableRowsEqual(newRow, oldRow);

      if (areObjectsTheSame.field === "createdAt") {
        const isValid = validationRules.createdAt.validate(newRow.createdAt);

        if (isValid !== true) {
          setAlertTitle(isValid);
          setIsAlert(true);
          return;
        } else {
          const unixTimestampDate = newRow.createdAt;
          const unixTimestampTime = oldRow.createdAt;
          newRow = {
            ...newRow,
            createdAt: mergeDateAndTime(unixTimestampDate, unixTimestampTime),
          };
        }
      }

      if (areObjectsTheSame.field === "time") {
        const regExp = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!regExp.test(newRow.time)) {
          setAlertTitle("Please enter time in HH:mm format");
          setIsAlert(true);
          return;
        } else {
          const unixTimestampDate = newRow.createdAt;
          const unixTimestampTime = dayjs(convertTime(newRow.time)).unix();
          newRow = {
            ...newRow,
            createdAt: mergeDateAndTime(unixTimestampDate, unixTimestampTime),
          };
        }
      }

      if (areObjectsTheSame.field === "typeOfMeasurement") {
        if (!newRow.typeOfMeasurement) {
          setAlertTitle("Measurement type cannot be empty");
          setIsAlert(true);
          return;
        }
      }

      if (
        areObjectsTheSame.field === "measurement" &&
        newRow.typeOfMeasurement !== "2"
      ) {
        const isValid = validationRules.measurement.validate(
          newRow.measurement
        );
        if (isValid !== true) {
          setAlertTitle(isValid);
          setIsAlert(true);
          return;
        } else {
          newRow = { ...newRow, measurement: Number(newRow.measurement) };
        }
      }

      if (!areObjectsTheSame.result) {
        const { time: _, ...theRest } = newRow;

        const row: Measurement = {
          ...(theRest as Measurement),
          updatedAt: dayjs().unix(),
        };

        if (
          oldRow.typeOfMeasurement === "2" &&
          newRow.typeOfMeasurement !== "2"
        ) {
          delete row.afterMealMeasurement;
        }

        const res = await mutateRow(row as Measurement);

        if (res.payload) {
          return row;
        }
        return oldRow;
      } else {
        return oldRow;
      }
    },

    [mutateRow]
  );

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    // Тут надо сделать чо та нормальное
    console.log("error", error);
  }, []);

  const handleCellDoubleClick = (params: GridCellParams) => {
    if (
      params.field === "measurement" &&
      params.row.typeOfMeasurement === "2"
    ) {
      const data: Measurement = params.row;

      setAfterMealMeasurement(data);

      handleOpenEditAfterMealMeasurementModal();
      params.isEditable = false;
    }
  };
  return (
    <>
      <Paper
        sx={{
          margin: "0 auto",
          height: "71.1vh",
          maxWidth: "711px",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          pageSizeOptions={[tablePageSize]}
          sx={dataGridStylesTest}
          hideFooterSelectedRowCount
          onPaginationModelChange={handlePaginationModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onCellDoubleClick={handleCellDoubleClick}
          disableColumnMenu
          slots={{
            toolbar: CustomTableToolbar,
          }}
          slotProps={controlPanelStyles}
          initialState={{
            columns: {
              columnVisibilityModel: {
                updatedAt: false, // Скрыть колонку по умолчанию
              },
            },
          }}
          localeText={{
            noRowsLabel: "No measurements",
          }}
        />
      </Paper>
      <ConfirmModal
        status={removeStatus}
        open={openRemoveConfirmModal}
        idToRemove={idToRemove}
        handleClose={handleCloseRemoveConfirmCloseModal}
        confirmFn={dispatchRemoveMeasurement}
        title={"Are you sure you'd like to remove the measurement?"}
      />
      <EditAfterMeasurementModal
        afterMealMeasurement={afterMealMeasurement}
        setAfterMealMeasurement={setAfterMealMeasurement}
        open={openEditAfterMealMeasurementModal}
        handleClose={handleCloseEditAfterMealMeasurementModal}
      />
      <CustomErrorAlert
        title={alertTitle}
        isAlert={isAlert}
        setIsAlert={setIsAlert}
      />
    </>
  );
};
