#import <React/RCTBridgeDelegate.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
