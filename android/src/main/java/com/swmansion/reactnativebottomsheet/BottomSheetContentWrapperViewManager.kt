package com.swmansion.reactnativebottomsheet

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.viewmanagers.BottomSheetContentWrapperViewManagerDelegate
import com.facebook.react.viewmanagers.BottomSheetContentWrapperViewManagerInterface
import com.facebook.react.views.view.ReactViewGroup

/**
 * The in-flow wrapper around the sheet's content: a plain view natively. Its own component type
 * only so its shadow node can report the card's scale (see `BottomSheetCardContent` in
 * `ShadowNodes.h`).
 */
@ReactModule(name = BottomSheetContentWrapperViewManager.NAME)
class BottomSheetContentWrapperViewManager :
  ViewGroupManager<ReactViewGroup>(),
  BottomSheetContentWrapperViewManagerInterface<ReactViewGroup> {

  companion object {
    const val NAME = "BottomSheetContentWrapperView"
  }

  private val generatedDelegate = BottomSheetContentWrapperViewManagerDelegate(this)
  private val delegate =
    object : ViewManagerDelegate<ReactViewGroup> {
      override fun setProperty(view: ReactViewGroup, propName: String, value: Any?) {
        if (propName == "pointerEvents") {
          view.pointerEvents = PointerEvents.parsePointerEvents(value as? String)
        } else {
          generatedDelegate.setProperty(view, propName, value)
        }
      }

      override fun receiveCommand(view: ReactViewGroup, commandName: String, args: ReadableArray) {
        generatedDelegate.receiveCommand(view, commandName, args)
      }
    }

  override fun getDelegate(): ViewManagerDelegate<ReactViewGroup> = delegate

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup =
    ReactViewGroup(context)
}
