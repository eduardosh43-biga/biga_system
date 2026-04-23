class KitchenChannel < ApplicationCable::Channel
  def subscribed
    stream_from "Kitchen_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
