//
//  DashboardViewController.swift
//  Dad
//
//  Created by Alex Sanchez on 2019-06-02.
//

import UIKit

class DashboardViewController: UIViewController {
    
    private let messageTextView: UITextView = {
        let textView = UITextView()
        textView.isEditable = false
        textView.textAlignment = .center
        textView.translatesAutoresizingMaskIntoConstraints = false
        textView.isScrollEnabled = false
        return textView
    }()
    
    private let logoutButton: UIButton = {
        let button = UIButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle("Log Out", for: .normal)
        return button
    }()
    
    override func loadView() {
        super.loadView()
        view.backgroundColor = .gray
        logoutButton.addTarget(self, action: #selector(logoutButtonPressed), for: .touchUpInside)
        view.addSubview(messageTextView)
        view.addSubview(logoutButton)
        
        NSLayoutConstraint.activate([
            messageTextView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            messageTextView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            logoutButton.centerXAnchor.constraint(equalTo: messageTextView.centerXAnchor),
            logoutButton.topAnchor.constraint(equalTo: messageTextView.bottomAnchor, constant: 30)
        ])
        
    }
    
    override func viewDidLoad() {
        let this = self
        NetworkController.makeNetworkCall(path: "", method: "GET") { data, response, error in
            guard let data = data else {
                return
            }
            guard let messageText = String.init(data: data, encoding: String.Encoding.utf8) else {
                print("data not what expected: \(data)")
                return
            }
            DispatchQueue.main.async {
                this.messageTextView.text = messageText
                this.messageTextView.sizeToFit()
            }
        }
    }
    
    @objc func logoutButtonPressed(sender: UIButton!) {
        print("logout button pressed")
        
        let this = self
        NetworkController.makeNetworkCall(path: "logout", method: "POST") { data, response, error in
            
            if let _ = error {
                print("error in networking")
                return
            }
            // would need to check if cookie session is still valid. If it's ever not valid, move to login screen, and delete cookies
            
            print("Response: " + String.init(data: data!, encoding: String.Encoding.utf8)!)
            
            if((response as? HTTPURLResponse)?.statusCode == 200) {
                // delete cookies
                NetworkController.deleteCookies()
                DispatchQueue.main.async {
                    //this.navigationController?.popViewController(animated: true)
                    /*let loginScreen = ViewController()
                    loginScreen.navigationItem.title = "Start"
                    loginScreen.modalTransitionStyle = .flipHorizontal
                    let navigationController = UINavigationController()
                    navigationController.pushViewController(loginScreen, animated: false)
                    this.present(loginScreen, animated: true, completion: {
                        //this.dismiss(animated: false, completion: nil)
                    })
 */
                    this.dismiss(animated: true, completion: nil)
                }
            }
        }
    }
    
    
}
