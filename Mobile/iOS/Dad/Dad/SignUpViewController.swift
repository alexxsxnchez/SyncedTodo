//
//  SignUpViewController.swift
//  Dad
//
//  Created by Alex Sanchez on 2019-06-02.
//

import UIKit

class SignUpViewController: UIViewController {
    
    private let usernameField: UITextField = {
        let textField = UITextField()
        //
        textField.tintColor = .white
        textField.placeholder = "Username"
        textField.translatesAutoresizingMaskIntoConstraints = false
        //textField.borderStyle = UITextField.BorderStyle.none
        textField.textColor = .white
        textField.attributedPlaceholder = NSAttributedString(string: "Username", attributes: [NSAttributedString.Key.foregroundColor: UIColor.white])
        //textField.underline(colour: .white)
        //textField.backgroundColor =
        return textField
    }()
    
    private let passwordField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Password"
        textField.translatesAutoresizingMaskIntoConstraints = false
        textField.borderStyle = UITextField.BorderStyle.line
        textField.textContentType = .oneTimeCode
        textField.isSecureTextEntry = true
        
        return textField
    }()
    
    private let confirmPasswordField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Confirm Password"
        textField.translatesAutoresizingMaskIntoConstraints = false
        textField.borderStyle = UITextField.BorderStyle.none
        textField.textContentType = .oneTimeCode
        textField.isSecureTextEntry = true
        
        return textField
    }()
    
    private let nameField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "Name"
        textField.translatesAutoresizingMaskIntoConstraints = false
        textField.borderStyle = UITextField.BorderStyle.roundedRect
        return textField
    }()
    
    private let errorMessage: UILabel = {
        let label = UILabel()
        label.isHidden = true
        label.textColor = .blue
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private let signUpButton: UIButton = {
        let button = UIButton()
        button.translatesAutoresizingMaskIntoConstraints = false
        button.setTitle("Sign Up", for: .normal)
        return button
    }()
    
    override func loadView() {
        super.loadView()
        view.backgroundColor = .red
        signUpButton.addTarget(self, action: #selector(signUpButtonPressed(sender:)), for: .touchUpInside)
        view.addSubview(usernameField)
        view.addSubview(passwordField)
        view.addSubview(confirmPasswordField)
        view.addSubview(errorMessage)
        view.addSubview(nameField)
        view.addSubview(signUpButton)
        NSLayoutConstraint.activate([
            usernameField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            usernameField.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -30),
            usernameField.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 50),
            passwordField.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
            passwordField.topAnchor.constraint(equalTo: usernameField.bottomAnchor, constant: 30),
            passwordField.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 50),
            confirmPasswordField.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
            confirmPasswordField.topAnchor.constraint(equalTo: passwordField.bottomAnchor, constant: 30),
            confirmPasswordField.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 50),
            nameField.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
            nameField.topAnchor.constraint(equalTo: confirmPasswordField.bottomAnchor, constant: 30),
            signUpButton.centerXAnchor.constraint(equalTo: usernameField.centerXAnchor),
            signUpButton.topAnchor.constraint(equalTo: nameField.bottomAnchor, constant: 30),
            errorMessage.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            errorMessage.topAnchor.constraint(equalTo: signUpButton.bottomAnchor, constant: 20)
        ])
        usernameField.underline(colour: .white)
    }
    
    func showErrorMessage(message: String) {
        let this = self
        DispatchQueue.main.async {
            this.errorMessage.text = message
            this.errorMessage.isHidden = false
        }
    }
    
    @objc func signUpButtonPressed(sender: UIButton!) {
        print("signup");
        guard let username = usernameField.text, let password = passwordField.text, let confirm = confirmPasswordField.text, let name = nameField.text else {
            print("can't have empty username or password or name");
            showErrorMessage(message: "Cannot have empty fields!")
            return
        }
        
        guard username != "" && password != "" && confirm != "" && name != "" else {
            print("can't have empty username or password or name");
            showErrorMessage(message: "Cannot have empty fields!")
            return
        }
        
        guard password == confirm else {
            print("passwords don't match!")
            showErrorMessage(message: "Passwords don't match!")
            return
        }
        
        let data: [String:Any] =
            ["username": username,
             "password": password,
             "name": name
        ]
        let jsonData = try! JSONSerialization.data(withJSONObject: data, options: [])
        
        let this = self
        NetworkController.makeNetworkCall(path: "signup", method: "POST", jsonBody: jsonData) { data, response, error in
            if let error = error {
                print("error in networking")
                print(error)
                this.showErrorMessage(message: "Network error!")
                return
            }
            
            print("Response: " + String.init(data: data!, encoding: String.Encoding.utf8)!)
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
                this.showErrorMessage(message: "Network error!")
                return
            }
            
        }
        
    }
    
}

extension UITextField {
    
    func underline(colour: UIColor) {
        let border = CALayer()
        let width = CGFloat(5.0)
        border.borderColor = colour.cgColor
        border.backgroundColor = colour.cgColor
        print(self.bounds)
        print(self.frame.size)
        border.frame = CGRect(x: 0, y: self.frame.size.height - width, width: self.frame.size.width, height: width)
        //border.borderWidth = width
        self.layer.addSublayer(border)
        self.layer.masksToBounds = true
    }
}
