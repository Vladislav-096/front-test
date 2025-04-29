import { Box, TextField } from "@mui/material";
import { GridFilterInputValueProps, useGridRootProps } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import SyncIcon from "@mui/icons-material/Sync";

export const CustomMeasurementTypeFilterField = (
  props: GridFilterInputValueProps
) => {
  const rootProps = useGridRootProps();
  const { item, applyValue, focusElementRef } = props;
  const [value, setValue] = useState<string>("");

  const filterTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [applying, setIsApplying] = useState<boolean>(false);

  const onValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value: newValue } = e.target;
    updateValue(newValue);
  };

  const updateValue = (newValue: string) => {
    clearTimeout(filterTimeout.current);
    setValue(newValue);

    setIsApplying(true);
    filterTimeout.current = setTimeout(() => {
      setIsApplying(false);
      applyValue({ ...item, value: newValue });
    }, rootProps.filterDebounceMs);
  };

  useEffect(() => {
    return () => {
      clearTimeout(filterTimeout.current);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "end",
        height: 48,
        pl: "20px",
      }}
    >
      <TextField
        value={value}
        onChange={onValueChange}
        variant="standard"
        placeholder="Value"
        label="Value"
        inputRef={focusElementRef}
        type="text"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
          input: applying ? { endAdornment: <SyncIcon /> } : {},
        }}
      />
    </Box>
  );
};
