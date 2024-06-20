package com.dg.deukgeun.api;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;


/*
 * 사업자 등록번호가 있는지, 사업중인지, 휴업중인지, 폐업했는 지 알려주는 조회 메서드
 * 매서드 호출 코드 : 
   CRNumberCheckApi.check("0000000000"); // 정적 메서드로, 별도의 객체 호출 없이 바로 메서드 호출
 * 입력 파라미터 : 사업자등록번호 String
 * 리턴값 : 에러 발생 혹은 검색한 사업자가 없는 경우 : null
 * 사업 중 : "01"
 * 휴업 중 : "02"
 * 폐업 : "03"
 */
@RequiredArgsConstructor
public class CRNumberCheckApi {
    public static String check(String crNumber){
        OkHttpClient client = new OkHttpClient().newBuilder().build();
        MediaType mediaType = MediaType.parse("application/json");
        List<String> arry = new ArrayList();
        arry.add(crNumber);
        JSONObject requestBody = new JSONObject();
        requestBody.put("b_no",arry);
        RequestBody body = RequestBody.create(requestBody.toString(),mediaType);
        Request request = new Request.Builder()
        .url("http://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=B8En3lj6sn4M2uiAa5ayQNQjKS3qsF%2FDvj08ECmznIpUuLnFwsAsGgM3wgkF5j%2BC48QyFKNcnH0OJIvCHa%2BCHg%3D%3D")
        .method("POST",body)
        .addHeader("Content-Type", "application/json")
        .build();
        try{
            Response response = client.newCall(request).execute();
            JSONObject responseBody = new JSONObject();
            JSONParser jsonParser = new JSONParser();
            responseBody = (JSONObject)jsonParser.parse(response.body().string());
            List<JSONObject> dList = (List<JSONObject>) responseBody.get("data");
            String result = (String)dList.get(0).get("b_stt_cd");
            if (result.length() <1) return null;
            else return result;
        } catch(Exception e){
            return null;
        }
    }
}
