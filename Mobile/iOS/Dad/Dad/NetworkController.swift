//
//  NetworkController.swift
//  Dad
//
//  Created by Alex Sanchez on 2019-06-16.
//

import Foundation

class NetworkError : Error {
    
    private var message: String?
    
    init(message: String?) {
        self.message = message
    }
    
    func getMessage() -> String? {
        return message
    }
}

class NetworkController {
    
    private static let baseURLString: String = {
        let port = 8000
        let ipPort = 153
        return "http://10.0.0.\(ipPort):\(port)"
    }()
    
    static func makeNetworkCall(path: String, method: String, jsonBody: Data? = nil, completion: @escaping (Data?, URLResponse?, Error?) -> Void) {
        guard let baseURL = URL(string: baseURLString) else {
            completion(nil, nil, NetworkError(message: "invalid url"))
            return
        }
        
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        
        switch(method) {
            case "GET":
                request.httpMethod = method
            case "POST":
                request.httpMethod = method
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                request.httpBody = jsonBody
            default:
                fatalError("http method not supported")
        }
        
        URLSession.shared.dataTask(with: request, completionHandler: completion).resume()
    }
    
    // FOR NOW STORE IN LOCAL STORAGE. WILL NEED TO BE MOVED TO KEYCHAIN THOUGH
    static func storeCookies(urlString: String = baseURLString) {
        guard let url = URL(string: urlString) else {
            fatalError("url not valid")
        }
        let cookiesStorage = HTTPCookieStorage.shared
        let userDefaults = UserDefaults.standard
        
        var cookieDict = [String : AnyObject]()
        
        for cookie in cookiesStorage.cookies(for: url)! {
            cookieDict[cookie.name] = cookie.properties as AnyObject?
        }
        
        userDefaults.set(cookieDict, forKey: "cookiesKey")
    }
    
    static func restoreCookies() {
        let cookiesStorage = HTTPCookieStorage.shared
        let userDefaults = UserDefaults.standard
        
        if let cookieDictionary = userDefaults.dictionary(forKey: "cookiesKey") {
            
            for (_, cookieProperties) in cookieDictionary {
                if let cookie = HTTPCookie(properties: cookieProperties as! [HTTPCookiePropertyKey : Any] ) {
                    cookiesStorage.setCookie(cookie)
                }
            }
        }
    }
    
    static func deleteCookies(urlString: String = baseURLString) {
        guard let url = URL(string: urlString) else {
            fatalError("url not valid")
        }
        let cookiesStorage = HTTPCookieStorage.shared
        let userDefaults = UserDefaults.standard
        
        userDefaults.removeObject(forKey: "cookiesKey")
        for cookie in cookiesStorage.cookies(for: url)! {
            cookiesStorage.deleteCookie(cookie)
        }
    }

    
}
