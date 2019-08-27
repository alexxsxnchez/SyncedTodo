//
//  ViewController.swift
//  Dad
//
//  Created by Alex Sanchez on 2019-05-23.
//

import UIKit

class ViewController: UIViewController {

    private let usernameField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Username"
        textField.translatesAutoresizingMaskIntoConstraints = false
        textField.borderStyle = UITextField.BorderStyle.roundedRect
        return textField
    }()
    
    private let passwordField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Password"
        textField.translatesAutoresizingMaskIntoConstraints = false
        textField.borderStyle = UITextField.BorderStyle.roundedRect
        textField.isSecureTextEntry = true
        return textField
    }()
    
    private let loginButton: UIButton = {
        let button = UIButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle("Login", for: .normal)
        return button
    }()
    
    private let signUpButton: UIButton = {
        let button = UIButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle("Sign Up", for: .normal)
        return button
    }()
    
    private let errorMessage: UILabel = {
        let label = UILabel()
        label.isHidden = true
        label.textColor = .blue
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()

    override func loadView() {
        super.loadView()
        loginButton.addTarget(self, action: #selector(loginButtonPressed(sender:)), for: .touchUpInside)
        signUpButton.addTarget(self, action: #selector(signUpButtonPressed(sender:)), for: .touchUpInside)
        view.backgroundColor = .red
        view.addSubview(usernameField)
        view.addSubview(passwordField)
        view.addSubview(loginButton)
        view.addSubview(signUpButton)
        view.addSubview(errorMessage)
        NSLayoutConstraint.activate([
                usernameField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                usernameField.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -30),
                usernameField.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 50),
                passwordField.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
                passwordField.topAnchor.constraint(equalTo: usernameField.bottomAnchor, constant: 30),
                passwordField.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 50),
                loginButton.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
                loginButton.topAnchor.constraint(equalTo: passwordField.bottomAnchor, constant: 30),
                signUpButton.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
                signUpButton.topAnchor.constraint(equalTo: loginButton.bottomAnchor, constant: 30),
                errorMessage.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                errorMessage.topAnchor.constraint(equalTo: signUpButton.bottomAnchor, constant: 20)
        ])
        
        
        // fixes white space underneath navigation bar
        //automaticallyAdjustsScrollViewInsets = false
    }
    
    override func viewWillAppear(_ animated: Bool) {
        errorMessage.isHidden = true
    }
    
    func showErrorMessage(message: String) {
        let this = self
        DispatchQueue.main.async {
            this.errorMessage.text = message
            this.errorMessage.isHidden = false
        }
    }
    
    @objc func loginButtonPressed(sender: UIButton!) {
        print("loginnnn");
        
        guard let username = usernameField.text, let password = passwordField.text, username != "" && password != "" else {
            print("can't have empty username or password");
            showErrorMessage(message: "Cannot have empty fields!")
            return
        }
        
        let data: [String:Any] =
            ["username": username,
             "password": password
            ]
        let jsonData = try! JSONSerialization.data(withJSONObject: data, options: [])
        
        let this = self
        NetworkController.makeNetworkCall(path: "login", method: "POST", jsonBody: jsonData) { data, response, error in

            if let _ = error {
                print("error in networking")
                this.showErrorMessage(message: "Network error!")
                return
            }
            let responseData = String.init(data: data!, encoding: String.Encoding.utf8)!
            print("Response: " + responseData)
            if((response as? HTTPURLResponse)?.statusCode == 200) {
                NetworkController.storeCookies()
                DispatchQueue.main.async {
                    
                    let dashboardVC = DashboardViewController()
                    dashboardVC.modalTransitionStyle = .flipHorizontal
                    let navigationController = UINavigationController()
                    navigationController.pushViewController(dashboardVC, animated: false)
                    this.present(navigationController, animated: true, completion: nil)
                    //this.navigationController?.pushViewController(DashboardViewController(), animated: true)
                }
            } else {
                print((response as? HTTPURLResponse)!.statusCode)
                this.showErrorMessage(message: responseData)
                return
            }
            
        }
        
    }
    
    @objc func signUpButtonPressed(sender: UIButton!) {
        navigationController?.pushViewController(SignUpViewController(), animated: true)
    }
}
