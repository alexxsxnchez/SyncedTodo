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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func loadView() {
        super.loadView()
        loginButton.addTarget(self, action: #selector(loginButtonPressed(sender:)), for: .touchUpInside)
        view.backgroundColor = .red
        view.addSubview(usernameField)
        view.addSubview(passwordField)
        view.addSubview(loginButton)
        NSLayoutConstraint.activate([
                usernameField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                usernameField.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -30),
                passwordField.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
                passwordField.topAnchor.constraint(equalTo: usernameField.bottomAnchor, constant: 30),
                loginButton.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
                loginButton.topAnchor.constraint(equalTo: passwordField.bottomAnchor, constant: 30)
        ])
        
        
        // fixes white space underneath navigation bar
        //automaticallyAdjustsScrollViewInsets = false
    }
    
    @objc func loginButtonPressed(sender: UIButton!) {
        print("loginnnn")
    }
    
    

}
