//
//  Router.swift
//  Dad
//
//  Created by Alex Sanchez on 2019-05-23.
//

import Foundation
import UIKit

class Router: NSObject {
    
    let navigationController: UINavigationController
    
    init(navigationController: UINavigationController) {
        self.navigationController = navigationController
        super.init();
        
        let controller = ViewController()
        controller.navigationItem.title = "Start"
        navigationController.pushViewController(controller, animated: false)
    }
    
}
