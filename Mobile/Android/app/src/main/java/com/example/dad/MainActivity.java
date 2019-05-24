package com.example.dad;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.android.volley.*;
import com.android.volley.toolbox.*;
import org.json.*;

import java.net.HttpURLConnection;

public class MainActivity extends AppCompatActivity {


    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        requestQueue = Volley.newRequestQueue(this);
        makeAuthCall();
    }

    /*

        none of this response stuff is being called but at least with new url, request is being received by server..

     */
    private void makeAuthCall() {
        String url = "http://10.0.0.150:8000/health";//"http://localhost:8000";
        JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(final JSONObject response) {
                Log.i("tag", "got response from func");
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        TextView textView = findViewById(R.id.textView);
                        try {
                            textView.setText(response.toString(4));
                        } catch(JSONException e) {
                            textView.setText("error processing json");
                        }
                    }
                });
            }
        }, null) {

            @Override
            protected Response<JSONObject> parseNetworkResponse (NetworkResponse response){
                final int statusCode = response.statusCode;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        TextView textView = findViewById(R.id.textView);
                        if(statusCode == HttpURLConnection.HTTP_OK) {
                            System.out.println("response ok!");
                            textView.setText("response ok!");
                        } else {
                            System.out.println("(ERROR) - response is " + statusCode);
                            textView.setText("(ERROR) - response is " + statusCode);
                        }
                    }
                });
                return super.parseNetworkResponse(response);
            }
        };

        requestQueue.add(getRequest);
    }


}
