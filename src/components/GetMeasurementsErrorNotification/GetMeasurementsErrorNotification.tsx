import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { buttonDisabledStyles } from "../../constants/constants";
import { RequestError } from "../../types/types";

interface GetMeasurementsErrorNotification {
  refetch: () => void;
  error: RequestError;
}

export const GetMeasurementsErrorNotification = ({
  refetch,
  error,
}: GetMeasurementsErrorNotification) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const disableButtonTemporarily = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve(refetch());
      }, 2000);
    });
  };

  const handleRefetch = async () => {
    setIsDisabled(true);
    await disableButtonTemporarily();
    setIsDisabled(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box>
        <Typography
          component="h2"
          sx={{ marginBottom: "10px", fontSize: "27px" }}
        >
          {error.message}
        </Typography>
      </Box>
      {error.code === "500" && (
        <Button
          variant="contained"
          disabled={isDisabled}
          onClick={handleRefetch}
          sx={buttonDisabledStyles}
        >
          Try again
        </Button>
      )}
    </Box>
  );
};
