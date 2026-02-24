import { getUserId, getUserPhone, supabase } from '@/config/supabase';
import { api } from '@/service/api';
import axios from 'axios';



export const getCourses = async () => {
    try {
      const res = await api.get("/courses");
      // console.log(res.data)
    return res.data.courses;
    } catch (error) {
      console.log(error)
    }
}

export const getEnrolledCourses = async () => {
    try {
      const uid = await getUserId();       
    
      const res = await api.post("/enrolled-courses",{uid});
      // console.log(res.data)
    return res.data.enrolledCourses;
    } catch (error) {
      console.log("there"+error)
    }
}


 export const enrollCourse = async (courseId:any) => {
    try {
      const uid = await getUserId();       
      const res = await api.post("/enroll-course",{uid,courseId});
    return res.data;
    } catch (error) {
      console.log(error)
    }
}

export const getCourseById = async (courseId:any) => {
    try {
      const res = await api.get(`/course/${courseId}`);
    return res.data;
    } catch (error) {
      console.log(error)
    }
}

export const markChapterComplete = async (
  courseId: any,
  chapterIndex: number
) => {
  try {
    const uid = await getUserId();

    const res = await api.put("/completed", {
      uid,
      courseId,
      chapterIndex,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const generateCertificate = async (id:any) => {
  try {
    const uid = await getUserId();
    

    const response = await api.post(
      "/certificate",
      { courseId: id,uid },
    );

    return response.data.certificateUrl;

  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
};

export const getSkillPoints = async (courseId:any) => {
  try {
    const res = await api.post("/skill-points", { courseId });
    return res.data?.skillPoints;
  } catch (error) {
    console.log(error);
  }
}

export const updateSkillPoints = async (courseId: any) => {
  try {
    const uid = await getUserId();

    const res = await api.put("/update-skill-points", { uid, courseId });

    return res.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // ✅ If it's 400, just return silently
      if (error.response?.status === 400) {
        return;
      }

      // ❌ Log other errors
      console.log(
        "update skill points error:",
        error.response?.status,
        error.response?.data
      );
    } else {
      console.log("update skill points unexpected error:", error);
    }
  }
};







