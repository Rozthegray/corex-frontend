import axios from "axios";
import Cookies from "js-cookie";

// Prioritize the .env.local variable to kill cache, but safely fallback to IPv4
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase() || "")) {
    // Only inject idempotency key if it is a standard JSON request.
    // File uploads (FormData) often trigger preflight crashes when custom headers are attached.
    if (config.headers["Content-Type"] !== "multipart/form-data") {
      if (!config.headers["X-Idempotency-Key"]) {
        config.headers["X-Idempotency-Key"] = crypto.randomUUID();
      }
    }
  }
  return config;
});

// ==========================================
// CLIENT API LIBRARY
// ==========================================

export const Api = {
  Admin: {
    getStats: () => apiClient.get("/admin/stats").then(res => res.data),
    getTransactions: () => apiClient.get("/admin/transactions").then(res => res.data),
    getDocuments: (category?: string) => 
      apiClient.get("/admin/documents", { params: { category } }).then(res => res.data),
    deleteDocument: (id: string) => apiClient.delete(`/admin/documents/${id}`).then(res => res.data),
  },

  Auth: {
    login: (credentials: any) => apiClient.post("/auth/login", credentials),
    register: (data: any) => apiClient.post("/auth/register", data),
  },
  
  User: {
    getProfile: () => apiClient.get("/user/profile").then(res => res.data),
    updateProfile: (data: { level?: string; pathway?: string }) => 
      apiClient.patch("/user/profile", data).then(res => res.data),
  },

  MockExams: {
    generate: (courseCode: string, examType: "test" | "exam") =>
      apiClient.post("/mock-exams/generate", { course_code: courseCode, exam_type: examType }).then(res => res.data),
    submit: (examId: string, submissions: Record<number, string>, timeSpent: number) =>
      apiClient.post(`/mock-exams/${examId}/submit`, { student_submissions: submissions, time_spent_seconds: timeSpent }).then(res => res.data),
  },

  Summarizer: {
    generateTopic: (courseCode: string, topicTitle: string) =>
      apiClient.post("/summarizer/generate", { course_code: courseCode, topic_title: topicTitle }).then(res => res.data),
  },

  Billing: {
    topUpTokens: (packageType: "10k" | "50k") =>
      apiClient.post("/payments/top-up-tokens", { package: packageType }).then(res => res.data),
    initiatePro: () =>
      apiClient.post("/payments/initiate").then(res => res.data),
  },

  Documents: {
    // Admin upload - Strictly matching the backend /upload without trailing slashes
    upload: (formData: FormData) => 
      apiClient.post("/documents/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }),
    // Student browsing
    getLibrary: (category?: string) => 
      apiClient.get("/documents/library", { params: { category } }).then(res => res.data),
    // Download raw file
    download: async (id: string, filename: string) => {
      const response = await apiClient.get(`/documents/${id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    // PDF generation (WeasyPrint)
    renderPdf: (data: any) => 
      apiClient.post("/generator/render-pdf", data, { responseType: "blob" }),
  }
};