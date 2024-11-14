import { mainAxios } from "@/lib/mainAxios";

export class Endpoints {
  static async getRulesComments(ruleId: string) {
    try {
      const { data } = await mainAxios.get(
        `/rules-regulations/${ruleId}/comments`
      );
      return data;
    } catch (error) {
      console.log({ error });
    }
  }

  static async postRulesComment(formData: FormData) {
    try {
      const res = await mainAxios.post(`/rules-regulations/comment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  static async putLikeComment(commentId: string) {
    try {
      const res = await mainAxios.put(
        `/rules-regulations/comment/${commentId}/like`
      );
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
  static async putDislikeComment(commentId: string) {
    try {
      const res = await mainAxios.put(
        `/rules-regulations/comment/${commentId}/dislike`
      );
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
}
