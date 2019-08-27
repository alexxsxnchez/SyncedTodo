//
//  LoadScreen.swift
//  Dad
//
//  Created by Alex Sanchez on 2019-06-16.
//

import UIKit

class LoadScreen: UIViewController {
    
    private let loader: UIActivityIndicatorView = {
        let loader = UIActivityIndicatorView()
        loader.translatesAutoresizingMaskIntoConstraints = false
        return loader
    }()
    
    override func loadView() {
        super.loadView()
        view.addSubview(loader)
        NSLayoutConstraint.activate([
            loader.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loader.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    override func viewDidLoad() {
        loader.startAnimating()
        NetworkController.restoreCookies()
        let this = self
        NetworkController.makeNetworkCall(path: "user", method: "GET") { data, response, error in
            if let error = error {
                print("network error")
                print(error)
                
                return
            }
            
            guard let statusCode = (response as? HTTPURLResponse)?.statusCode else {
                fatalError("can't get status code of response")
            }
            let loginScreen = ViewController()
            loginScreen.navigationItem.title = "Start"
            loginScreen.modalTransitionStyle = .flipHorizontal
            let navigationController = UINavigationController()
            navigationController.pushViewController(loginScreen, animated: false)
            
            switch(statusCode) {
                case 200:
                    DispatchQueue.main.async {
                        this.present(navigationController, animated: false, completion: {
                            let dashboardVC = DashboardViewController()
                            dashboardVC.modalTransitionStyle = .flipHorizontal
                            let dashboardNavigationController = UINavigationController()
                            dashboardNavigationController.pushViewController(dashboardVC, animated: false)
                            loginScreen.present(dashboardNavigationController, animated: false, completion: nil)
                        })
                }
                case 401:
                    DispatchQueue.main.async {
                        this.present(navigationController, animated: true, completion: nil)
                    }
                default:
                    fatalError("unexpected status code")
            }
        }
    }
    
    
}
