import { router } from "expo-router";
import { api } from "./api";
import { getUserId, supabase } from "@/config/supabase";

export const getMyJobs = async () => {
  const id = await getUserId();

  try {
    const res = await api.get(`/jobs/worker/my/${id}`);
    console.log("GET JOB:", res.data.jobs);
    const jobs = res.data.jobs ?? [];
    const filterJobs = jobs.filter((job: any) => job.status !== "COMPLETED");
    console.log("FILTERED JOBS:", filterJobs);

    return filterJobs;

    // console.log("FILTERED JOBS:",filterJobs[0]._id)
  } catch (err: any) {
    console.log("GET JOB ERROR:", err?.response?.data || err.message);
    throw err;
  }
};

export const getWorkerJobHistory = async () => {
  const id = await getUserId();

  try {
    const res = await api.get(`/jobs/worker/my/${id}`);
    return res.data.jobs ?? [];
  } catch (err: any) {
    console.log("GET JOB HISTORY ERROR:", err?.response?.data || err.message);
    throw err;
  }
};

export const getMyWithdrawalRequests = async () => {
  try {
    const res = await api.get("/worker/withdrawals");
    return res.data.requests ?? [];
  } catch (err: any) {
    console.log(
      "GET WITHDRAWAL REQUESTS ERROR:",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const createWithdrawalRequest = async ({
  amount,
  note,
}: {
  amount: number;
  note?: string;
}) => {
  try {
    const res = await api.post("/worker/withdrawals", { amount, note });
    return res.data;
  } catch (err: any) {
    console.log(
      "CREATE WITHDRAWAL REQUEST ERROR:",
      err?.response?.data || err.message,
    );
    throw err;
  }
};

export const acceptJobOffer = async (jobId: string) => {
  console.log(jobId);
  try {
    const res = await api.patch(`/jobs/accept/${jobId}`);
    router.push({
      pathname: "/(app)/(jobs)/live-job",
      params: {
        id: jobId,
      },
    });

    return res.data;
  } catch (err: any) {
    console.log("ACCEPT JOB ERROR:", err?.response?.data || err.message);
    throw err;
  }
};

export const updateJobStatus = async (jobId: string, status: string) => {
  const uid = await getUserId();

  console.log(jobId);
  try {
    await api.patch(`/jobs/${uid}/${jobId}/status`, {
      status,
    });
    return true;
  } catch (err) {
    console.log("UPDATE JOB STATUS ERROR:", err);
    return false;
  }
};

export const sendLocationToServer = async (
  latitude: number,
  longitude: number,
) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;

  await api.post("/worker/location", {
    latitude,
    longitude,
  });
};

export const goOnline = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    console.log("NO TOKEN FOUND");
    return;
  }

  console.log("REGISTERING WORKER ONLINE");

  await api.post(
    "/worker/online",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const toogleOndutyButton = async (onDuty: any) => {
  try {
    await api.post(`/worker/duty`, { onDuty });
  } catch {
    console.log("On duty toggle failed");
  }
};

export const updateJobLocation = async (
  jobId: string,
  latitude: number,
  longitude: number,
) => {
  try {
    await api.post("/worker/job/location", {
      jobId,
      latitude,
      longitude,
    });
  } catch (err) {
    console.log("Update job location failed", err);
  }
};

export const verifyArival = async (jobId: string, otp: string) => {
  try {
    await api.patch(`/jobs/${jobId}/arrived`, { otp });
    router.push({
      pathname: "/(app)/(jobs)/inspect",
      params: {
        id: jobId,
      },
    });
    return true;
  } catch (err) {
    console.log("Verify arival failed", err);
    return false;
  }
};

export const verifyTaskType = async (jobId: string, actualSize: string) => {
  console.log(actualSize);
  try {
    await api.patch(`/jobs/${jobId}/inspect`, { actualSize });
    return true;
  } catch (err) {
    console.log("Verify task type failed", err);
    return false;
  }
};

export const completeActiveJob = async (
  jobId: string,
  paymentMethod: "CASH" | "ONLINE",
) => {
  try {
    await api.patch(`/jobs/${jobId}/complete`, { paymentMethod });
    return true;
  } catch (err) {
    console.log("Complete job failed", err);
    return false;
  }
};
