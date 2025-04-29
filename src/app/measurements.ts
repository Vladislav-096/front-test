import { z } from "zod";
import { API_URL } from "../constants/constants";
import { validateGetResponse, validateResponse } from "./validationResponse";

const DishStatisticSchema = z.object({
  id: z.number(),
  calories: z.number(),
  proteins: z.number(),
  carbohydrates: z.number(),
  fats: z.number(),
  comment: z.string(),
});

export type DishStatistic = z.infer<typeof DishStatisticSchema>;

const MealSchema = z.object({
  id: z.number(),
  portion: z.number(),
  dish: z.string(),
  statistic: DishStatisticSchema.optional(),
});

const MealsSchema = z.array(MealSchema);
export type Meals = z.infer<typeof MealsSchema>;

const AfterMealMeasurementSchema = z.object({
  meal: MealsSchema,
});

const MeasurementSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  typeOfMeasurement: z.string(),
  measurement: z.number(),
  afterMealMeasurement: AfterMealMeasurementSchema.optional(),
});

const MeasurementsSchema = z.array(MeasurementSchema);
export type Measurement = z.infer<typeof MeasurementSchema>;

const TypeOfMeasurementsSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const TypesOfMeasurementsSchema = z.array(TypeOfMeasurementsSchema);
export type TypesOfMeasurements = z.infer<typeof TypesOfMeasurementsSchema>;

export interface filters extends Record<string, string> {
  createdAt_gte: string;
  createdAt_lte: string;
}

export const getMeasurements = async (
  filters?: filters
): Promise<Measurement[]> => {
  let url = `${API_URL}/measurements`;

  if (filters) {
    const queryParams = new URLSearchParams(filters).toString();
    url = `${url}?${queryParams}`;
  }

  return fetch(url, {
    method: "GET",
  })
    .then(validateGetResponse)
    .then((res) => res.json())
    .then((data) => MeasurementsSchema.parse(data))
    .catch((err) => {
      console.log("getMeasurements functions error", err);
      throw err;
    });
};

export const getTypesOfMeasurements = async () => {
  return fetch(`${API_URL}/typesOfMeasuremens`, {
    method: "GET",
  })
    .then(validateGetResponse)
    .then((res) => res.json())
    .then((data) => TypesOfMeasurementsSchema.parse(data))
    .catch((err) => {
      console.log("getTypesOfMeasurements functions error", err);
      throw err;
    });
};

export const addMeasurement = async (data: Measurement) => {
  return fetch(`${API_URL}/measurements`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(validateResponse)
    .catch((err) => {
      console.log("addMeasurement function error", err);
      throw err;
    });
};

export const editMeasurement = async (data: Measurement) => {
  return fetch(`${API_URL}/measurements/${data.id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(validateResponse)
    .catch((err) => {
      console.log("editMeasurement function error", err);
      throw err;
    });
};

export const removeMeasurement = async (id: string) => {
  return fetch(`${API_URL}/measurements/${id}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  })
    .then(validateResponse)
    .catch((err) => {
      console.log("removeMeasurement function error", err);
      throw err;
    });
};
